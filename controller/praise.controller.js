import dbModel from '../model/db_model.js'

/** 添加文章点赞 */
export const insertPraise = async (req, res) => {
  try {
    const { articleId, userId, moment } = req.body
    if (articleId === undefined || userId === undefined || moment === undefined)
      return res.send({ code: 400, message: 'insertPraise参数错误' })
    const praise = await dbModel.getPraiseByUserIdAndArticleId(userId, articleId)
    if (praise.length > 0) {
      return res.send({ code: 400, message: '该文章已点赞' })
    }
    const result = await dbModel.insertPraise({ article_id:articleId, user_id: userId, moment })
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertPraise error:', error)
    res.send({ code: 500, message: '添加文章点赞失败' })
  }
}

/** 取消或者删除点赞根据用户id */
export const deletePraiseByUserId = async (req, res) => {
  try {
    const { userId, articleId } = req.body
    if (userId === undefined)
      return res.send({ code: 400, message: 'deletePraiseByUserId参数错误' })
    await dbModel.deletePraiseByUserId(userId, articleId)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deletePraiseByUserId error:', error)
    res.send({ code: 500, message: '取消或者删除点赞失败' })
  }
}

/** 添加评论点赞 */
export const insertPraiseComment = async (req, res) => {
  try {
    const { commentId, userId, moment } = req.body
    if (commentId === undefined || userId === undefined || moment === undefined)
      return res.send({ code: 400, message: 'insertPraiseComment参数错误' })
    const praise = await dbModel.getPraiseByUserIdAndCommentId(userId, commentId)
    if (praise.length > 0) {
      return res.send({ code: 400, message: '该评论已点赞' })
    }
    const result = await dbModel.insertPraiseComment({ comment_id:commentId, user_id: userId, moment })
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertPraiseComment error:', error)
    res.send({ code: 500, message: '添加评论点赞失败' })
  }
}

/** 取消或者删除评论点赞根据用户id */
export const deleteCommentPraiseByUserId = async (req, res) => {
  try {
    const { userId,commentId } = req.body
    if (userId === undefined)
      return res.send({ code: 400, message: 'deleteCommentPraiseByUserId参数错误' })
    await dbModel.deleteCommentPraiseByUserId(userId,commentId)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteCommentPraiseByUserId error:', error)
    res.send({ code: 500, message: '取消或者删除评论点赞失败' })
  }
}
