import db from './db.js'
const { query } = db

/** 判断用户是否已注册（复用 login 查询） */
export const isRegister = (value) => {
  return login(value)
}

/** 新增用户 */
export const insertUser = (value) => {
  let sql = 'INSERT INTO users SET ?;'
  return query(sql, value)
}

/** 按用户名查询用户记录（密码校验由上层完成） */
export const login = (value) => {
  let sql = 'SELECT * FROM users WHERE name = ?;'
  const name = value && value.name ? value.name : ''
  return query(sql, [name])
}

/** 按用户ID查询用户记录 */
export const getUserById = (value) => {
  let sql = 'SELECT * FROM users WHERE id = ?;'
  const id = value && value.id ? value.id : ''
  return query(sql, [id])
}

/** 更新用户密码 */
export const changePassword = (value) => {
  let sql = 'UPDATE users SET password = ? WHERE id = ?;'
  const { id, newPassword } = value
  return query(sql, [newPassword, id])
}

/** 更新用户名称 */
export const changeUserName = (value) => {
  let sql = 'UPDATE users SET name = ? WHERE id = ?;'
  const { id, newName } = value
  return query(sql, [newName, id])
}