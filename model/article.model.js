import db from './db.js'
const { query } = db

/** 
 * 分页查询文章/图库列表（支持状态/分类/类别筛选与模糊搜索） 
*/
export const getArticlePage = ({pageSize, nowPage, state, subsetId, serchTerm, classify}) => {
  let sql
  const offset = (nowPage - 1) * pageSize
  if (serchTerm) {
    const term = `%${serchTerm}%`
    sql = 'SELECT * FROM article WHERE (title LIKE ? OR `introduce` LIKE ?) AND classify = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [term, term, classify, offset, pageSize])
  } else if (subsetId > -1 && typeof subsetId === 'number') {
    sql = 'SELECT * FROM article WHERE subset_id = ? AND classify = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [subsetId, classify, offset, pageSize])
  } else if (typeof subsetId === 'string') {
    sql = 'SELECT * FROM article WHERE subset_id = ? AND classify = ? ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [subsetId, classify, offset, pageSize])
  } else if (state > -1) {
    sql = 'SELECT * FROM article WHERE state = ? AND classify = 0 ORDER BY id DESC LIMIT ?, ?;'
    return query(sql, [state, offset, pageSize])
  }
  sql = 'SELECT * FROM article WHERE classify = ? ORDER BY id DESC LIMIT ?, ?;'
  return query(sql, [classify, offset, pageSize])
}

/** 
 * 统计文章/图库数量（支持状态/分类/类别筛选与模糊搜索）
*/
export const getArticleCount = ({state, subsetId, serchTerm, classify}) => {
  let sql
  if (serchTerm) {
    const term = `%${serchTerm}%`
    sql = 'SELECT COUNT(*) AS count FROM article WHERE (title LIKE ? OR `introduce` LIKE ?) AND classify = ?;'
    return query(sql, [term, term, classify])
  } else if (subsetId > -1 && typeof subsetId === 'number') {
    sql = 'SELECT COUNT(*) AS count FROM article WHERE subset_id = ? AND classify = ?;'
    return query(sql, [subsetId, classify])
  } else if (typeof subsetId === 'string') {
    sql = 'SELECT COUNT(*) AS count FROM article WHERE subset_id = ? AND classify = ?;'
    return query(sql, [subsetId, classify])
  } else if (state > -1) {
    sql = 'SELECT COUNT(*) AS count FROM article WHERE state = ? AND classify = 0;'
    return query(sql, [state])
  }
  sql = 'SELECT COUNT(*) AS count FROM article WHERE classify = ?;'
  return query(sql, [classify])
}

/** 
 * 根据文章 id 更新文章状态（仅 classify=0 文章）
*/
export const changeArticleState = (id, state) => {
  let sql = 'UPDATE article SET state = ? WHERE id = ? AND classify = 0;'
  return query(sql, [state, id])
}

/** 
 * 根据文章 id 删除文章/图库 
*/
export const deleteArticleById = (id) => {
  let sql = 'DELETE FROM article WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 根据文章id返回文章数据
 */
export const getArticleById = (id) => {
  let sql = 'SELECT * FROM article WHERE id = ?;'
  return query(sql, [id])
}

/**
 * 新增文章或者图库
 */
export const insertArticle = (data) => {
  let sql = 'INSERT INTO article SET ?;'
  return query(sql, [data])
}

/**
 * 根据文章/图库id修改文章/图库数据
 */
export const updateArticleById = (id, data) => {
  let sql = 'UPDATE article SET ? WHERE id = ?;'
  return query(sql, [data, id])
}