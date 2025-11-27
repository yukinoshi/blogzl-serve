import dbModel from '../model/db_model.js'
import dayjs from 'dayjs'
import redis from '../model/redis.js'

const TOTAL_VISITS_KEY = 'blog:visits:total'
const TODAY_VISITS_KEY_PREFIX = 'blog:visits:today:'

/**
 * 辅助函数：获取并初始化计数器
 * 如果 Redis 中不存在，则从数据库查询并写入 Redis
 */
const getAndInitCounts = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  const todayKey = TODAY_VISITS_KEY_PREFIX + todayStr

  let total = await redis.get(TOTAL_VISITS_KEY)
  let today = await redis.get(todayKey)

  // 如果数据缺失，则回源到数据库查询
  if (total === null || today === null) {
    const todayStart = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')

    const [totalResult, todayResult] = await Promise.all([
      dbModel.getVisitCount(),
      dbModel.getVisitCount(todayStart),
    ])

    const dbTotal = totalResult[0]?.count || 0
    const dbToday = todayResult[0]?.count || 0

    if (total === null) {
      await redis.set(TOTAL_VISITS_KEY, dbTotal)
      total = dbTotal
    }
    if (today === null) {
      //今日缓存有效期为25小时，防止跨天访问量统计错误
      await redis.setex(todayKey, 60 * 60 * 25, dbToday)
      today = dbToday
    }
  }

  return {
    total: parseInt(total),
    today: parseInt(today)
  }
}

/** 记录网站访问次数 */
export const recordVisit = async (req, res) => {
  try {
    const now = dayjs()
    const todayStr = now.format('YYYY-MM-DD')
    const todayKey = TODAY_VISITS_KEY_PREFIX + todayStr

    const forwarded = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']
    const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) || req.ip || req.connection?.remoteAddress || ''

    dbModel.insertVisit({ visit_time: now.format('YYYY-MM-DD HH:mm:ss'), ip })

    // 计数器自增
    const exists = await redis.exists(TOTAL_VISITS_KEY)
    if (!exists) {
      // 如果 Redis 没数据，先初始化一遍
      await getAndInitCounts()
    }

    const [newTotal, newToday] = await Promise.all([
      redis.incr(TOTAL_VISITS_KEY),
      redis.incr(todayKey)
    ])

    if (newToday === 1) {
      redis.expire(todayKey, 60 * 60 * 25)
    }

    res.send({ code: 200, data: { count: newTotal, today: newToday } })
  } catch (error) {
    console.error('recordVisit error:', error)
    try {
      // 简单的降级：只查库
      const totalVisitsResult = await dbModel.getVisitCount()
      const totalVisits = totalVisitsResult[0]?.count || 0
      const todayVisitsResult = await dbModel.getVisitCount(today.format('YYYY-MM-DD HH:mm:ss'))
      const todayVisits = todayVisitsResult[0]?.count || 0
      res.send({ code: 200, data: { count: totalVisits, today: todayVisits } }) // 今日暂时返回0或查库
    } catch (e) {
      res.send({ code: 500, message: '记录访问次数失败' })
    }
  }
}

/** 获取总访问次数和今日访问次数 */
export const getVisits = async (req, res) => {
  try {
    // 直接从 Redis 获取，如果没数据会自动回源数据库
    const counts = await getAndInitCounts()
    res.send({ code: 200, data: { count: counts.total, today: counts.today } })
  }
  catch (error) {
    console.error('getVisits error:', error)
    res.send({ code: 500, message: '获取访问次数失败' })
  }
}
/** 获取一周内每天的访问次数或者一个月内每天的访问次数 */
export const getVisitsStats = async (req, res) => {
  try {
    const { period } = req.body // 'week' 或 'month'
    let startDate = dayjs()
    if (period === 'week') {
      startDate = startDate.subtract(6, 'day').startOf('day') // 最近7天
    } else if (period === 'month') {
      startDate = startDate.subtract(29, 'day').startOf('day') // 最近30天
    } else {
      return res.send({ code: 400, message: '无效的时间周期参数' })
    }
    const statsResult = await dbModel.getVisitsStats(startDate.format('YYYY-MM-DD HH:mm:ss'))
    // 构建完整的日期访问次数映射，确保每一天都有数据
    const statsMap = {}
    statsResult.forEach(item => {
      // 将数据库返回的日期格式化为 MM-DD，以便与后续循环中的 key 匹配
      const key = dayjs(item.date).format('MM-DD')
      statsMap[key] = item.count
    })
    const stats = []
    const days = period === 'week' ? 7 : 30
    for (let i = 0; i < days; i++) {
      const date = startDate.add(i, 'day').format('MM-DD')
      stats.push({ date, count: statsMap[date] || 0 })
    }
    res.send({ code: 200, data: stats })
  } catch (error) {
    console.error('getVisitsStats error:', error)
    res.send({ code: 500, message: '获取访问次数失败' })
  }
}