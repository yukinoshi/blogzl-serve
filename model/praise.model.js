import db from './db.js'
const { query } = db

/** 新建点赞 */
export const insertPraise = (obj) => {
  let sql = 'INSERT INTO praise SET ?;'
  return query(sql, obj)
}

/** 新建评论点赞 */
export const insertPraiseComment = (obj) => {
  let sql = 'INSERT INTO praise_comment SET ?;'
  return query(sql, obj)
}

/** 根据文章 id 获取点赞数 */
export const getPraiseCountByArticleId = (articleId) => {
  let sql = 'SELECT COUNT(*) AS count FROM praise WHERE article_id = ?;'
  return query(sql, [articleId])
}

/** 根据评论 id 获取点赞数 */
export const getPraiseCountByCommentId = (commentId) => {
  let sql = 'SELECT COUNT(*) AS count FROM praise_comment WHERE comment_id = ?;'
  return query(sql, [commentId])
}

/** 根据用户 id 获取点赞记录 */
export const getPraiseByUserId = (userId) => {
  let sql = 'SELECT * FROM praise WHERE user_id = ?;'
  return query(sql, [userId])
}

/** 根据用户 id 获取评论点赞记录 */
export const getCommentPraiseByUserId = (userId) => {
  let sql = 'SELECT * FROM praise_comment WHERE user_id = ?;'
  return query(sql, [userId])
}

/** 根据用户 id 删除点赞记录 */
export const deletePraiseByUserId = (userId, articleId) => {
  let sql = 'DELETE FROM praise WHERE user_id = ? AND article_id = ?;'
  return query(sql, [userId, articleId])
}

/** 根据用户 id 删除该评论点赞记录 */
export const deleteCommentPraiseByUserId = (userId, commentId) => {
  let sql = 'DELETE FROM praise_comment WHERE user_id = ? AND comment_id = ?;'
  return query(sql, [userId, commentId])
}

/** 判断是否点赞过（用户 id + 文章 id） */
export const getPraiseByUserIdAndArticleId = (userId, articleId) => {
  let sql = 'SELECT * FROM praise WHERE user_id = ? AND article_id = ?;'
  return query(sql, [userId, articleId])
}

/** 判断是否点赞过（用户 id + 评论 id） */
export const getPraiseByUserIdAndCommentId = (userId, commentId) => {
  let sql = 'SELECT * FROM praise_comment WHERE user_id = ? AND comment_id = ?;'
  return query(sql, [userId, commentId])
}
