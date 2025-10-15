import db from './db.js'
const { query } = db

/** 分页查询留言/消息列表 */
export const getMessagePage = (pageSize, nowPage) => {
  let sql = `SELECT * FROM message order by id desc LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`
  return query(sql)
}

/** 统计留言/消息总数 */
export const getMessageCount = () => {
  let sql = 'SELECT COUNT(*) AS count FROM message;'
  return query(sql)
}

/** 将指定留言/消息标记为已读 */
export const messageIsread = (id) => {
  let sql = 'UPDATE message SET isread = 1 WHERE id = ?;'
  return query(sql, id)
}
