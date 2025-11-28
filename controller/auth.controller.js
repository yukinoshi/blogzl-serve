import dbModel from '../model/db_model.js'
import hash from '../lib/hash.js'
import jwt from '../lib/jwt.js'

const REFRESH_COOKIE_NAME = 'refreshToken'
const refreshCookieBaseOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
})
const refreshCookieMaxAge = 7 * 24 * 60 * 60 * 1000 // 7 天

/** 判断用户是否已注册 */
export const isRegister = async (req, res) => {
  const result = await dbModel.isRegister(req.body)
  let code = 400
  if (result.length > 0) {
    code = 200
  }
  res.send({ code })
}

/** 注册用户 */
export const insertUser = async (req, res) => {
  try {
    const body = { ...req.body }
    if (body.password) {
      body.password = await hash.hashPassword(body.password)
    }
    await dbModel.insertUser(body)
    res.send({ code: 200 })
  } catch (error) {
    console.error('insertUser error:', error)
    res.send({ code: 500 })
  }
}

/** 用户登录 */
export const login = async (req, res) => {
  try {
    const result = await dbModel.login(req.body)
    if (result.length === 0) return res.send({ code: 400 })//没有该用户
    const user = result[0]
    const match = await hash.comparePassword(req.body.password || '', user.password)

    if (match) {
      const payload = { id: user.id, name: user.name }
      const token = jwt.generateToken(payload)
      const refreshToken = jwt.generateRefreshToken(payload)
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        ...refreshCookieBaseOptions(),
        maxAge: refreshCookieMaxAge,
      })
      return res.send({
        code: 200,
        data: {
          ...user,
          password: undefined,
          token,
        }
      })
    }
    return res.send({ code: 400 })
  } catch (error) {
    console.error('login error:', error)
    res.send({ code: 500, message: '登录失败' })
  }
}

/** 使用 refreshToken 换取新的 token */
export const refreshToken = async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME]
  if (!refreshTokenFromCookie) {
    return res.status(401).send({ code: 401, message: 'No refresh token provided' })
  }
  try {
    const decoded = jwt.verifyRefreshToken(refreshTokenFromCookie)
    const result = await dbModel.getUserById({ id: decoded.id })
    if (result.length === 0) {
      return res.status(401).send({ code: 401, message: 'User not found' })
    }
    const user = result[0]
    const payload = { id: user.id, name: user.name }
    const token = jwt.generateToken(payload)
    const newRefreshToken = jwt.generateRefreshToken(payload)
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
      ...refreshCookieBaseOptions(),
      maxAge: refreshCookieMaxAge,
    })
    res.send({
      code: 200,
      data: {
        token,
      }
    })
  } catch (error) {
    const isExpired = error && error.name === 'TokenExpiredError'
    console.error('refresh token error:', error?.message || error)
    return res.status(401).send({ code: 401, message: isExpired ? 'Refresh token expired' : 'Invalid refresh token' })
  }
}

/** 退出登录：清除刷新 token */
export const logout = async (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieBaseOptions())
  res.send({ code: 200 })
}

/** 校验token */
export const verify = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).send({ code: 401, message: 'No token provided' })
  }
  try {
    const decoded = jwt.verifyToken(token)
    const result = await dbModel.getUserById({ id: decoded.id })
    if (result.length === 0) {
      return res.status(401).send({ code: 401, message: 'User not found' })
    }
    const user = result[0]
    res.send({
      code: 200,
      data: {
        ...user,
        password: undefined,
      }
    })
  } catch (error) {
    const isExpired = error && error.name === 'TokenExpiredError'
    console.error('verify token error:', error?.message || error)
    return res.status(401).send({ code: 401, message: isExpired ? 'Token expired' : 'Invalid token' })
  }
}

/** 修改密码 */
export const changePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body
    const result = await dbModel.getUserById({ id })
    if (result.length === 0) {
      return res.send({ code: 400, message: '用户不存在' })
    }
    const user = result[0]
    const match = await hash.comparePassword(oldPassword || '', user.password)
    if (!match) {
      return res.send({ code: 400, message: '旧密码错误' })
    }
    const hashedNewPassword = await hash.hashPassword(newPassword)
    await dbModel.changePassword({ id, newPassword: hashedNewPassword })
    res.send({ code: 200 })
  } catch (error) {
    console.error('changePassword error:', error)
    res.send({ code: 500, message: '修改密码失败' })
  }
}

/** 修改用户名 */
export const changeUserName = async (req, res) => {
  try {
    const { id, newName } = req.body
    await dbModel.changeUserName({ id, newName })
    res.send({ code: 200 })
  } catch (error) {
    console.error('changeUserName error:', error)
    res.send({ code: 500, message: '修改用户名失败' })
  }
}