import db from './db.js'
const { query } = db

/** 获取label标签 */
export const getLabel = (id) => {
  if (id) {
    let sql = 'SELECT * FROM label WHERE id = ?;'
    return query(sql, [id])
  }
  let sql = 'SELECT * FROM label;'
  return query(sql)
}

/** 新建label标签 */
export const insertLabel = (data) => {
  let sql = 'INSERT INTO label SET ?;'
  return query(sql, data)
}

/** 根据labelId删除label标签 */
export const deleteLabel = (id) => {
  let sql = 'DELETE FROM label WHERE id = ?;'
  return query(sql, [id])
}
