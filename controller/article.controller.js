import dbModel from '../model/db_model.js'
import redis from '../model/redis.js'
import config from '../config/default.js'

// 规范化标签：确保写库时始终为 JSON 字符串数组
const normalizeLabel = (label) => {
  if (Array.isArray(label)) return JSON.stringify(label)
  if (label === undefined || label === null) return null
  // 单个字符串时包装为数组再序列化
  return JSON.stringify([label])
}

// 生成文章列表的 Redis Key
const getArticleredisKey = (params) => {
  const { state, subsetId, pageSize, nowPage, classify } = params
  return `blog:article:list:${classify}:${subsetId}:${state}:${nowPage}:${pageSize}`
}

// 清除文章列表缓存
const clearArticleListCache = async () => {
  try {
    const keys = await redis.keys('blog:article:list:*')
    if (keys.length > 0) {
      await redis.del(keys)
    }
  } catch (error) {
    console.error('清除缓存失败:', error)
  }
}

// 返回非当前版本的 summary keys 列表
async function getOtherAiSummaryKeys(currentVersion) {
  const pattern = 'ai:*:article:summary:*';
  const otherKeys = [];
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
    cursor = nextCursor;
    for (const k of keys) {
      // key 形如 ai:v1:article:summary:123
      const parts = k.split(':');
      const version = parts[1];
      if (version !== currentVersion) {
        otherKeys.push(k);
      }
    }
  } while (cursor !== '0');
  return otherKeys;
}

// 清除文章摘要缓存
const clearArticleSummaryCache = async (articleId) => {
  try {
    const key = `ai:${config.AiVersion}:article:summary:${articleId}`
    await redis.del(key)
    //清除不是当前版本所有的ai缓存
    const keys = await getOtherAiSummaryKeys(config.AiVersion);
    if (keys.length === 0) return;
    const pipeline = redis.pipeline();
    keys.forEach(k => pipeline.unlink(k));
    await pipeline.exec();
  } catch (error) {
    console.error('清除文章摘要缓存失败:', error)
  }
}

/** 获取文章或者图库分页 */
export const getArticlePage = async (req, res) => {
  try {
    let countnum = undefined, countUnpublish = undefined, rediskey = '';
    const { count = true, pageSize = 10, nowPage = 1, state = -1, subsetId = -2, serchTerm = '', classify = 0 } = req.body
    if (!serchTerm) { //没有搜索词的时候直接尝试获取缓存
      rediskey = getArticleredisKey({ state: Number(state), subsetId: Number(subsetId), pageSize: Number(pageSize), nowPage: Number(nowPage), classify: Number(classify) })
      try {
        const redisData = await redis.get(rediskey)
        if (redisData) { //有缓存则直接返回
          return res.send(JSON.parse(redisData))
        }
      } catch (error) {
        console.error('getArticlePage redis get error:', error)
      }
    }
    const result = await dbModel.getArticlePage({ pageSize: Number(pageSize), nowPage: Number(nowPage), state: Number(state), subsetId: Number(subsetId), serchTerm, classify })
    if (count) {
      const countTemp = await dbModel.getArticleCount({ state: Number(state), subsetId: Number(subsetId), serchTerm, classify })
      countnum = countTemp[0].count
      if (classify === 0) {
        //没有发布的文章数量
        const unpublishTemp = await dbModel.getArticleCount({ state: 0, subsetId: Number(subsetId), serchTerm, classify })
        countUnpublish = unpublishTemp[0].count
      }
    }
    if (result.length > 0) {
      for (const item of result) {
        const { id } = item
        const praise = await dbModel.getPraiseCountByArticleId(id)
        item.praise = praise[0].count
        const comment = await dbModel.commentCount(id)
        item.comment = comment[0].count
        // 解析标签：容错历史非 JSON 数据，降级为 [label]
        let label = []
        if (item.label) {
          try { label = JSON.parse(item.label) } catch { label = [item.label] }
        }
        //如果解析出来的是[科普,测试]就不查询 如果是数字数组[1,2]就进行转换成为字符数组
        if (typeof label[0] === 'number') {
          const labelNames = []
          for (const labelId of label) {
            const labelTemp = await dbModel.getLabel(labelId)
            if (labelTemp.length > 0) {
              labelNames.push(labelTemp[0].label_name)
            }
          }
          item.label = labelNames
        } else {
          item.label = label
        }
      }
    }
    const responseData = { code: 200, data: { count: countnum, countUnpublish, list: result } }
    if (!serchTerm) { //没有搜索词的时候写缓存
      await redis.set(rediskey, JSON.stringify(responseData), 'EX', 300)
    }
    res.send(responseData)
  } catch (error) {
    console.error('getArticlePage error:', error)
    res.send({ code: 500, message: '获取文章失败' })
  }
}

/** 获取全部文章/图库列表 */
export const getAllarticle = async (req, res) => {
  try {
    const { classify } = req.body
    const result = await dbModel.getAllarticle(classify)
    if (result.length > 0) {
      for (const item of result) {
        const { id } = item
        const praise = await dbModel.getPraiseCountByArticleId(id)
        item.praise = praise[0].count
        const comment = await dbModel.commentCount(id)
        item.comment = comment[0].count
        // 解析标签：容错历史非 JSON 数据，降级为 [label]
        let label = []
        if (item.label) {
          try { label = JSON.parse(item.label) } catch { label = [item.label] }
        }
        //如果解析出来的是[科普,测试]就不查询 如果是数字数组[1,2]就进行转换成为字符数组
        if (typeof label[0] === 'number') {
          const labelNames = []
          for (const labelId of label) {
            const labelTemp = await dbModel.getLabel(labelId)
            if (labelTemp.length > 0) {
              labelNames.push(labelTemp[0].label_name)
            }
          }
          item.label = labelNames
        } else {
          item.label = label
        }
      }
    }
    res.send({ code: 200, data: { list: result } })
  } catch (error) {
    console.error('getAllarticle error:', error)
    res.send({ code: 500, message: '获取文章失败' })
  }
}

/** 根据分类关键词状态类别获取全部文章/图库列表 */
export const getAllarticleby = async (req, res) => {
  try {
    const { state = -1, subsetId = -2, serchTerm = '', classify = 0 } = req.body
    const result = await dbModel.getAllArticleby({ state: Number(state), subsetId: Number(subsetId), serchTerm, classify })
    if (result.length > 0) {
      for (const item of result) {
        const { id } = item
        const praise = await dbModel.getPraiseCountByArticleId(id)
        item.praise = praise[0].count
        const comment = await dbModel.commentCount(id)
        item.comment = comment[0].count
        // 解析标签：容错历史非 JSON 数据，降级为 [label]
        let label = []
        if (item.label) {
          try { label = JSON.parse(item.label) } catch { label = [item.label] }
        }
        //如果解析出来的是[科普,测试]就不查询 如果是数字数组[1,2]就进行转换成为字符数组
        if (typeof label[0] === 'number') {
          const labelNames = []
          for (const labelId of label) {
            const labelTemp = await dbModel.getLabel(labelId)
            if (labelTemp.length > 0) {
              labelNames.push(labelTemp[0].label_name)
            }
          }
          item.label = labelNames
        } else {
          item.label = label
        }
      }
    }
    res.send({ code: 200, data: { list: result } })
  } catch (error) {
    console.error('getAllarticle error:', error)
    res.send({ code: 500, message: '获取文章失败' })
  }
}

/** 修改文章状态 */
export const changeArticleState = async (req, res) => {
  try {
    const { articleId, state } = req.body
    if (state === undefined || articleId === undefined)
      return res.send({ code: 400, message: 'changeArticleState参数错误' })
    await dbModel.changeArticleState(Number(articleId), Number(state))
    await clearArticleListCache()
    res.send({ code: 200 })
  } catch (error) {
    console.error('changeArticleState error:', error)
    res.send({ code: 500, message: '修改文章状态失败' })
  }
}

/** 根据id删除文章 */
export const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.body
    await dbModel.deleteArticleById(Number(articleId))
    await clearArticleListCache()
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteArticle error:', error)
    res.send({ code: 500, message: '删除文章失败' })
  }
}

/** 根据文章状态查询文章 */
export const getArticleByState = async (req, res) => {
  try {
    const unpublish = await dbModel.getArticleCount(0, -1)
    const publish = await dbModel.getArticleCount(1, -1)
    res.send({
      code: 200, data: [
        { id: 0, name: '未发布', count: unpublish[0].count },
        { id: 1, name: '已发布', count: publish[0].count }
      ]
    })
  } catch (error) {
    console.error('getArticleByState error:', error)
    res.send({ code: 500, message: '获取文章失败' })
  }
}

/**
 * 根据文章id返回文章数据
 */
export const getArticleById = async (req, res) => {
  try {
    const { articleId, fingerprint } = req.body
    const result = await dbModel.getArticleById(Number(articleId))

    if (result.length > 0) {
      const comment = await dbModel.commentCount(articleId)
      result[0].comment = comment[0].count
      const praise = await dbModel.getPraiseCountByArticleId(articleId)
      result[0].praise = praise[0].count
      if (fingerprint) { //查询用户是否点赞
        const userPraise = await dbModel.getPraiseByUserIdAndArticleId(fingerprint, articleId)
        result[0].isPraise = userPraise.length > 0
      }
      const img = await dbModel.getFileByUrl(result[0].cover)
      if (img.length > 0) {
        result[0].coverId = img[0].id
      }
      // 兼容旧数据，如果解析失败则保持原样（可能是单个字符串）
      try {
        result[0].label = JSON.parse(result[0].label)
      } catch {
        result[0].label = [result[0].label]
      }
      // 浏览量处理：Redis 自增 + 延迟写入
      const viewKey = `blog:article:view:${articleId}`
      await redis.incr(viewKey)
      // 获取当前未同步的浏览量
      const cachedViews = await redis.get(viewKey)
      // 实时浏览量 = 数据库值 + 缓存增量
      result[0].views += Number(cachedViews || 0)

      res.send({ code: 200, data: result[0] })
    } else {
      res.send({ code: 404, message: '文章不存在' })
    }
  } catch (error) {
    console.error('getArticleById error:', error)
    res.send({ code: 500, message: '获取文章失败' })
  }
}

/** 
 * 根据文章id修改文章数据
 */
export const updateArticleById = async (req, res) => {
  try {
    const { id, value: { title, subset_id, label, introduce, content, cover, state } } = req.body
    if (id == undefined)
      return res.send({ code: 400, message: 'updateArticleById参数错误' })
    const data = {
      title,
      subset_id,
      label: normalizeLabel(label),
      introduce,
      content,
      cover,
      state
    }
    await dbModel.updateArticleById(Number(id), data)
    await clearArticleListCache()
    await clearArticleSummaryCache(id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('updateArticleById error:', error)
    res.send({ code: 500, message: '更新文章失败' })
  }
}

/**
 * 新增文章或者图库
 */
export const insertArticle = async (req, res) => {
  try {
    const { value: { title, subset_id, classify, label, introduce, content, cover, state, moment } } = req.body
    if (title == undefined || moment == undefined || classify == undefined)
      return res.send({ code: 400, message: 'insertArticle参数错误' })
    const data = {
      title,
      subset_id,
      classify,
      label: normalizeLabel(label),
      introduce,
      content,
      cover,
      state,
      moment
    }
    const result = await dbModel.insertArticle(data)
    await clearArticleListCache()
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertArticle error:', error)
    res.send({ code: 500, message: '新增文章失败' })
  }
}

// 定时同步文章浏览量到数据库 (每 1 分钟)
setInterval(async () => {
  try {
    const keys = await redis.keys('blog:article:view:*')
    if (keys.length === 0) return

    for (const key of keys) {
      const id = key.split(':').pop()
      // 原子性获取并清零 Redis 计数
      const count = await redis.getset(key, 0)

      // 如果有新增浏览量，则同步到数据库
      if (Number(count) > 0) {
        await dbModel.addArticleViews(Number(id), Number(count))
      }
    }
  } catch (error) {
    console.error('同步文章浏览量失败:', error)
  }
}, 60 * 1000)

