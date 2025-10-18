import express from 'express'
import config from './config/default.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import router from './routers/index.js'
import jwt from './lib/jwt.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(express.json())
// 仅保护 /files 静态资源需要 token；其他 data 下资源保持公开
const requireToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    return res.status(401).send({ code: 300, message: '没有token' })
  }
  try {
    jwt.verifyToken(token)
    next()
  } catch (e) {
    return res.status(401).send({ code: 300, message: '无效或过期的token' })
  }
}
// 注意顺序：先挂受保护的 /files，再挂公开的 data 静态
app.use('/files', requireToken, express.static(join(__dirname, 'data', 'files')))
app.use(express.static(join(__dirname, 'data')))
//跨域
app.use('/',(req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') res.send(200) //让options请求快速返回
  else next()
})

// 统一验证token的中间件
app.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/insertUser' || req.path === '/isRegister' || req.path === '/verify') {
    return next() // 登录和注册接口不需要验证token
  }
  const token = req.headers['authorization']?.split(' ')[1] // 获取Bearer token
  if (!token) {
    return res.status(401).send({ code: 300, message: '没有token' })
  }
  try {
    jwt.verifyToken(token)
    next()
  } catch (e) {
    return res.status(401).send({ code: 300, message: '无效或过期的token' })
  }
})


router(app)

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))