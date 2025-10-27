import db from './db.js'
const { query } = db

/** 
 * 分页查询日记列表（可按搜索词过滤）
*/
export const getDiaryPage = (pageSize, nowPage, serchTerm) => {
  let sql
  const offset = (nowPage - 1) * pageSize
  if (serchTerm) {
    const term = `%${serchTerm}%`
    sql = 'SELECT * FROM diary WHERE (title LIKE ? OR `content` LIKE ?) ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [term, term, offset, pageSize])
  }
  sql = 'SELECT * FROM diary ORDER BY id DESC LIMIT ?, ?;'
  return query(sql, [offset, pageSize])
}

/**
 * 根据日记id删除日记
 */
export const deleteDiaryById = (id) => {
  const sql = 'DELETE FROM diary WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 根据日记id获取日记
 */
export const getDiaryById = (id) => {
  const sql = 'SELECT * FROM diary WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 新增日记
 */
export const insertDiary = (value) => {
  const sql = 'INSERT INTO diary SET ?;'
  return query(sql, value)
}

/**
 * 修改日记
 */
export const updateDiary = (id, value) => {
  const sql = 'UPDATE diary SET ? WHERE id = ?;'
  return query(sql, [value, id])
}

/**
 * 统计日记数量
 */
export const getDiaryCount = (serchTerm) => {
  let sql = '';
  if (serchTerm) {
    const term = `%${serchTerm}%`
    sql = 'SELECT COUNT(*) AS count FROM diary WHERE (title LIKE ? OR `content` LIKE ?);'
    return query(sql, [term, term])
  }
  sql = 'SELECT COUNT(*) AS count FROM diary;'
  return query(sql)
}