import dbModel from '../model/db_model.js'

/** 添加文章点赞 */
export const insertPraise = async (req, res) => {
  try {
    const { article_id, user_id, moment } = req.body
    if (article_id === undefined || user_id === undefined || moment === undefined)
      return res.send({ code: 400, message: 'insertPraise参数错误' })
    const praise = await dbModel.getPraiseByUserIdAndArticleId(user_id, article_id)
    if (praise.length > 0) {
      return res.send({ code: 400, message: '该文章已点赞' })
    }
    const result = await dbModel.insertPraise({ article_id, user_id, moment })
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertPraise error:', error)
    res.send({ code: 500, message: '添加文章点赞失败' })
  }
}

/** 取消或者删除点赞根据用户id */
export const deletePraiseByUserId = async (req, res) => {
  try {
    const { user_id } = req.body
    if (user_id === undefined)
      return res.send({ code: 400, message: 'deletePraiseByUserId参数错误' })
    await dbModel.deletePraiseByUserId(user_id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deletePraiseByUserId error:', error)
    res.send({ code: 500, message: '取消或者删除点赞失败' })
  }
}
