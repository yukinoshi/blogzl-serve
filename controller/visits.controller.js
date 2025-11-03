import dbModel from '../model/db_model.js'
import dayjs from 'dayjs'

/** 记录访问次数 */
// 访问量统计不区分文章/页面，仅做简单的访问计数 然后分别输出总的访问量和今日访问量
export const recordVisit = async (req, res) => {
  try {
    // 使用 dayjs 输出本地时间格式 YYYY-MM-DD HH:mm:ss
    const now = dayjs()
    const today = dayjs().startOf('day')

    // 从请求中提取 IP（优先 X-Forwarded-For，然后 req.ip，再回退到连接地址）
    const forwarded = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']
    const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) || req.ip || req.connection?.remoteAddress || ''
    
    // 插入一条新的访问记录（包含本地时间和 IP）
    await dbModel.insertVisit({ visit_time: now.format('YYYY-MM-DD HH:mm:ss'), ip })
    // 计算总访问量
    const totalVisitsResult = await dbModel.getVisitCount()
    const totalVisits = totalVisitsResult[0]?.count || 0
    // 计算今日访问量
    const todayVisitsResult = await dbModel.getVisitCount(today.format('YYYY-MM-DD HH:mm:ss'))
    const todayVisits = todayVisitsResult[0]?.count || 0
    res.send({ code: 200, data: { count: totalVisits, today: todayVisits } })
  } catch (error) {
    console.error('recordVisit error:', error)
    res.send({ code: 500, message: '记录访问次数失败' })
  }
}

/** 获取总访问次数和今日访问次数 */
export const getVisits = async (req, res) => {
  try {
    const today = dayjs().startOf('day') // 设置为当天的开始时间（本地）
    // 计算总访问量
    const totalVisitsResult = await dbModel.getVisitCount()
    const totalVisits = totalVisitsResult[0]?.count || 0
    // 计算今日访问量
    const todayVisitsResult = await dbModel.getVisitCount(today.format('YYYY-MM-DD HH:mm:ss'))
    const todayVisits = todayVisitsResult[0]?.count || 0
    res.send({ code: 200, data: { count: totalVisits, today: todayVisits } })
  }
  catch (error) {
    console.error('getVisits error:', error)
    res.send({ code: 500, message: '获取访问次数失败' })
  }
}