import db from './db.js'
const { query } = db

/** 
 * 分页查询评论列表
*/
export const getCommentPage = (pageSize, nowPage) => {
  let sql = `SELECT * FROM comment order by id desc LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`
  return query(sql)
}

/** 
 * 统计评论总数（可按文章id） 
*/
export const commentCount = (id) => {
  if (id) {
    let sql = 'SELECT COUNT(*) AS count FROM comment WHERE article_id = ?;'
    return query(sql, [id])
  }
  let sql = 'SELECT COUNT(*) AS count FROM comment;'
  return query(sql)
}

/** 
 * 将指定评论标记为已读
*/
export const commentIsread = (id) => {
  let sql = 'UPDATE comment SET isread = 1 WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 根据文章 id 获取标题（用于评论联表展示）
*/
export const getArticleTitleById = (id) => {
  let sql = 'SELECT title FROM article WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 根据id删除评论
*/
export const deleteCommentById = (id) => {
  let sql = 'DELETE FROM comment WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 根据文章id获取评论信息
 */
export const getCommentsByArticleId = (articleId) => {
  let sql = 'SELECT * FROM comment WHERE article_id = ?;'
  return query(sql, [articleId])
}

/**
 * 根据评论id点赞评论
 */
export const likeCommentById = (id) => {
  let sql = 'UPDATE comment SET likes = likes + 1 WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 新增评论
 */
export const insertComment = (obj) => {
  let sql = 'INSERT INTO comment SET ?;'
  return query(sql, obj)
}