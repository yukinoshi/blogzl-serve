import db from './db.js'
const { query } = db

/** 
 * 获取资源分页
*/
export const getResourcePage = (pageSize, nowPage, subsetId, serchTerm) => {
  let sql;
  let offset = (nowPage - 1) * pageSize;
  const term = `%${serchTerm}%`;
  if (serchTerm && subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT * FROM resource WHERE (title LIKE ? OR `introduce` LIKE ?) AND subset_id = ? ORDER BY id DESC LIMIT ?, ?;';
    return query(sql, [term, term, subsetId, offset, pageSize])
  } else if (serchTerm && subsetId === -1 && typeof subsetId == 'number') {
    sql = 'SELECT * FROM resource WHERE (title LIKE ? OR `introduce` LIKE ?) AND subset_id IS NULL ORDER BY id DESC LIMIT ?, ?;';
    return query(sql, [term, term, offset, pageSize])
  } else if (serchTerm) {
    sql = 'SELECT * FROM resource WHERE (title LIKE ? OR `introduce` LIKE ?) ORDER BY id DESC LIMIT ?, ?;';
    return query(sql, [term, term, offset, pageSize])
  } else if (subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT * FROM resource WHERE subset_id = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [subsetId, offset, pageSize])
  } else if (subsetId === -1) {
    sql = 'SELECT * FROM resource WHERE subset_id IS NULL ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [offset, pageSize])
  }
  sql = 'SELECT * FROM resource ORDER BY id DESC LIMIT ?, ?;'
  return query(sql, [offset, pageSize])
}
/** 
 * 获取资源数量
*/
export const getResourceCount = (subsetId, serchTerm) => {
  let sql;
  const term = `%${serchTerm}%`;
  if (serchTerm && subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT COUNT(*) AS count FROM resource WHERE (title LIKE ? OR `introduce` LIKE ?) AND subset_id = ?;';
    return query(sql, [term, term, subsetId])
  } else if (serchTerm) {
    sql = 'SELECT COUNT(*) AS count FROM resource WHERE (title LIKE ? OR `introduce` LIKE ?);';
    return query(sql, [term, term])
  } else if (subsetId > -1 && typeof subsetId == 'number') {
    sql = 'SELECT COUNT(*) AS count FROM resource WHERE subset_id = ?;'
    return query(sql, [subsetId])
  } else if (typeof subsetId == 'string') {
    sql = 'SELECT COUNT(*) AS count FROM resource WHERE subset_id = ?;'
    return query(sql, [subsetId])
  } else if (subsetId === -1) {
    sql = 'SELECT COUNT(*) AS count FROM resource WHERE subset_id IS NULL;'
    return query(sql, [])
  }
  sql = 'SELECT COUNT(*) AS count FROM resource;'
  return query(sql, [])
}
/**
 * 根据id删除资源
*/
export const deleteResourceById = (id) => {
  const sql = 'DELETE FROM resource WHERE id = ?;';
  return query(sql, [id]);
}
/**
 * 根据id获取资源
*/
export const getResourceById = (id) => {
  const sql = 'SELECT * FROM resource WHERE id = ?;';
  return query(sql, [id]);
}
/**
 * 新增资源
 */
export const insertResource = (data) => {
  let sql = 'INSERT INTO resource SET ?;'
  return query(sql, [data]);
}
/**
 * 更新资源
 */
export const updateResourceById = (id, data) => {
  let sql = 'UPDATE resource SET ? WHERE id = ?;'
  return query(sql, [data, id]);
}
/**
 * 增加下载次数
 */
export const addResourceDownloadNum = (id) => {
  const sql = 'UPDATE resource SET downloads = downloads + 1 WHERE id = ?;';
  return query(sql, [id]);
}