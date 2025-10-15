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
