import dbModel from '../model/db_model.js'

/** 获取评论分页 */
export const getCommentPage = async (req, res) => {
  try {
    let count = undefined
    const { pageSize = 10, nowPage = 1 } = req.body
    const list = await dbModel.getCommentPage(Number(pageSize), Number(nowPage))
    if (req.body.count) {
      const countTemp = await dbModel.commentCount()
      count = countTemp[0].count
    }
    for (const item of list) {
      const { article_id } = item
      const article = await dbModel.getArticleTitleById(article_id)
      if (article.length > 0) {
        item.article = { id: article_id, title: article[0].title }
      }
      if (item.isread === 0) {
        await dbModel.commentIsread(item.id)
        item.isread = 1
      }
      item.article_id = undefined
      const Temppraise = await dbModel.getPraiseCountByCommentId(item.id)
      item.praise = Temppraise[0].count
    }
    res.send({ code: 200, data: { count, list } })
  } catch (error) {
    console.error('getCommentPage error:', error)
    res.send({ code: 500, message: '获取评论失败' })
  }
}

/** 统计评论总数 */
export const commentCount = async (req, res) => {
  try {
    const result = await dbModel.commentCount()
    res.send({ code: 200, data: result[0] })
  } catch (error) {
    console.error('commentCount error:', error)
    res.send({ code: 500 })
  }
}

/** 统计某文章的评论总数 */
export const getcommentCountByArticleId = async (req, res) => {
  try {
    const { articleId } = req.body
    const result = await dbModel.commentCount(articleId)
    res.send({ code: 200, data: result[0].count })
  } catch (error) {
    console.error('getcommentCountByArticleId error:', error)
    res.send({ code: 500 })
  }
}

/** 删除评论 */
export const deleteCommentById = async (req, res) => {
  try {
    const result = await dbModel.deleteCommentById(req.body.id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteCommentById error:', error)
    res.send({ code: 500 })
  }
}

/** 获取文章的评论信息 */
export const getCommentsByArticleId = async (req, res) => {
  try {
    const { articleId, fingerprint } = req.body
    const result = await dbModel.getCommentsByArticleId(Number(articleId))
    for (const item of result) {
      const Temppraise = await dbModel.getPraiseCountByCommentId(item.id)
      item.praise = Temppraise[0].count
      //是否点赞
      if (fingerprint) {
        const userPraise = await dbModel.getPraiseByUserIdAndCommentId(fingerprint, item.id)
        item.isPraise = userPraise.length > 0
      }
    }
    res.send({ code: 200, data: result })
  } catch (error) {
    console.error('getCommentsByArticleId error:', error)
    res.send({ code: 500, message: '获取文章评论失败' })
  }
}

/** 提交评论 */
export const submitComment = async (req, res) => {
  try {
    const { userId = -1, userName = '游客', articleId, moment, content } = req.body
    await dbModel.insertComment({
      user_id: Number(userId),
      user_name: userName,
      article_id: Number(articleId),
      moment,
      content
    })
    res.send({ code: 200 })
  } catch (error) {
    console.error('submitComment error:', error)
    res.send({ code: 500, message: '新增评论失败' })
  }
}