import db from './db.js'
const { query } = db

/** 获取各种分组信息 */
export const getSubset = (classify) => {
  let sql = 'SELECT * FROM subset WHERE classify = ?;'
  return query(sql, [classify])
}

/** 新建分类 */
export const insertSubset = (obj) => {
  let sql = 'INSERT INTO subset SET ?;'
  return query(sql, obj)
}

/** 根据subsetID修改分类名称 */
export const updateSubset = (id, subset_name) => {
  let sql = 'UPDATE subset SET subset_name = ? WHERE id = ?;'
  return query(sql, [subset_name, id])
}

/** 根据subsetID删除分类 */
export const deleteSubsetById = (id) => {
  let sql = 'DELETE FROM subset WHERE id = ?;'
  return query(sql, [id])
}
