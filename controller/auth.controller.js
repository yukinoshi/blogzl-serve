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
    if (result.length === 0) return res.send({ code: 400 })
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
