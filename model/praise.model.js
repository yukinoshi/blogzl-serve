import db from './db.js'
const { query } = db

/** 新建点赞 */
export const insertPraise = (obj) => {
  let sql = 'INSERT INTO praise SET ?;'
  return query(sql, obj)
}

/** 根据文章 id 获取点赞数 */
export const getPraiseCountByArticleId = (articleId) => {
  let sql = 'SELECT COUNT(*) AS count FROM praise WHERE article_id = ?;'
  return query(sql, [articleId])
}

/** 根据用户 id 获取点赞记录 */
export const getPraiseByUserId = (userId) => {
  let sql = 'SELECT * FROM praise WHERE user_id = ?;'
  return query(sql, [userId])
}

/** 根据用户 id 删除点赞记录 */
export const deletePraiseByUserId = (userId) => {
  let sql = 'DELETE FROM praise WHERE user_id = ?;'
  return query(sql, [userId])
}

/** 判断是否点赞过（用户 id + 文章 id） */
export const getPraiseByUserIdAndArticleId = (userId, articleId) => {
  let sql = 'SELECT * FROM praise WHERE user_id = ? AND article_id = ?;'
  return query(sql, [userId, articleId])
}
