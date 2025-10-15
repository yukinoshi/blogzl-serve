import db from './db.js'
const { query } = db

/** 
 * 统计文件数量
*/
export const getFileCount = (subsetId) => {
  let sql;
  if (subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT COUNT(*) AS count FROM file WHERE subset_id = ?;'
    return query(sql, [subsetId])
  } else if (typeof subsetId == 'string') {
    sql = 'SELECT COUNT(*) AS count FROM file WHERE subset_id = ?;'
    return query(sql, [subsetId])
  }
  sql = 'SELECT COUNT(*) AS count FROM file;'
  return query(sql)
}

/** 
 * 获取文件分页
*/
export const getFilePage = (pageSize, nowPage, subsetId) => {
  let sql;
  let offset = (nowPage - 1) * pageSize;
  if (subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT * FROM file WHERE subset_id = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [subsetId, offset, pageSize])
  } else if (typeof subsetId == 'string') {
    sql = 'SELECT * FROM file WHERE subset_id = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [subsetId, offset, pageSize])
  }
  sql = 'SELECT * FROM file ORDER BY id DESC LIMIT ?, ?;'
  return query(sql, [offset, pageSize])
}

/** 根据fileId移动文件分类 */
export const moveFileSubset = (id, subsetId) => {
  let sql = 'UPDATE file SET subset_id = ? WHERE id = ?;'
  return query(sql, [subsetId, id])
}
