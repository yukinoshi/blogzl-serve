import dbModel from '../model/db_model.js'
import hash from '../lib/hash.js'
import jwt from '../lib/jwt.js'

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
      const token = jwt.generateToken({ id: user.id, name: user.name })
      return res.send({
        code: 200,
        data: {
          ...user,
          password: undefined,
          token
        }
      })
    }
    return res.send({ code: 400 })
  } catch (error) {
    console.error('login error:', error)
    res.send({ code: 500, message: '登录失败' })
  }
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
