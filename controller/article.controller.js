import dbModel from '../model/db_model.js'

// 规范化标签：确保写库时始终为 JSON 字符串数组
const normalizeLabel = (label) => {
  if (Array.isArray(label)) return JSON.stringify(label)
  if (label === undefined || label === null) return null
  // 单个字符串时包装为数组再序列化
  return JSON.stringify([label])
}

/** 获取文章或者图库分页 */
export const getArticlePage = async (req, res) => {
  try {
    let count = undefined, countUnpublish = undefined
    const { pageSize = 10, nowPage = 1, state = -1, subsetId = -1, serchTerm = '', classify = 0 } = req.body
    const result = await dbModel.getArticlePage({ pageSize: Number(pageSize), nowPage: Number(nowPage), state: Number(state), subsetId: Number(subsetId), serchTerm, classify })
    if (req.body.count) {
      const countTemp = await dbModel.getArticleCount({ state: Number(state), subsetId: Number(subsetId), serchTerm, classify })
      count = countTemp[0].count
      //没有发布的文章数量
      const unpublishTemp = await dbModel.getArticleCount({ state: 0, subsetId: Number(subsetId), serchTerm, classify })
      countUnpublish = unpublishTemp[0].count
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
    res.send({ code: 200, data: { count, countUnpublish, list: result } })
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
    const { state= -1, subsetId= -1, serchTerm= '', classify= 0 } = req.body
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
    const { articleId } = req.body
    const result = await dbModel.getArticleById(Number(articleId))
    if (result.length > 0) {
      // 兼容旧数据，如果解析失败则保持原样（可能是单个字符串）
      try {
        result[0].label = JSON.parse(result[0].label)
      } catch {
        result[0].label = [result[0].label]
      }
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
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertArticle error:', error)
    res.send({ code: 500, message: '新增文章失败' })
  }
}

