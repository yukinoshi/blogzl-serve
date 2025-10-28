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
  } else if (subsetId === -1) {
    sql = 'SELECT COUNT(*) AS count FROM file WHERE subset_id IS NULL;'
    return query(sql)
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
  } else if (subsetId === -1) {
    sql = 'SELECT * FROM file WHERE subset_id IS NULL ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [offset, pageSize])
  }
  sql = 'SELECT * FROM file ORDER BY id DESC LIMIT ?, ?;'
  return query(sql, [offset, pageSize])
}

/** 根据fileId移动文件分类 */
export const moveFileSubset = (id, subsetId) => {
  let sql = 'UPDATE file SET subset_id = ? WHERE id = ?;'
  return query(sql, [subsetId, id])
}

/**
 * 新建文件
 */
export const insertFile = (obj) => {
  let sql = 'INSERT INTO file SET ?;'
  return query(sql, obj)
}

/**
 * 根据文件id删除文件
 */
export const deleteFileById = (id) => {
  if (typeof id == 'number') {
    let sql = 'DELETE FROM file WHERE id = ?;'
    return query(sql, [id])
  } else if (Array.isArray(id)) {
    let placeholders = id.map(() => '?').join(', ');
    let sql = `DELETE FROM file WHERE id IN (${placeholders});`
    return query(sql, id)
  }
}

/**
 * 根据文件id获取文件
 */
export const getFileById = (id) => {
  if (typeof id == 'number') {
    let sql = 'SELECT * FROM file WHERE id = ?;'
    return query(sql, id)
  } else if (Array.isArray(id)) {
    let placeholders = id.map(() => '?').join(', ');
    let sql = `SELECT * FROM file WHERE id IN (${placeholders});`
    return query(sql, id)
  }
}