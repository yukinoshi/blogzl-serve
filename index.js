import express from 'express'
import config from './config/default.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import router from './routers/index.js'
import jwt from './lib/jwt.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
// const requireToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]
//   if (!token) {
//     return res.status(401).send({ code: 300, message: '没有token' })
//   }
//   try {
//     jwt.verifyToken(token)
//     next()
//   } catch (e) {
//     return res.status(401).send({ code: 300, message: '无效或过期的token' })
//   }
// }

app.use(express.json())
// 静态资源：/files 公开可访问，其余 data 下资源也公开
app.use('/files', express.static(join(__dirname, 'data', 'files')))
app.use(express.static(join(__dirname, 'data')))
//跨域
app.use('/', (req, res, next) => {
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
  // 优先从 Authorization Bearer 读取；其次支持自定义头 X-Token；最后支持 query.token（便于上传组件通过 URL 携带）
  const authHeader = req.headers['authorization'] || req.headers['Authorization']
  const token = authHeader?.toString().split(' ')[1] || req.headers['x-token'] || req.query?.token
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

// 明确绑定到 127.0.0.1，输出更详细的启动日志，便于确认监听状态
const host = process.env.HOST || '127.0.0.1'
const server = app.listen(config.port, host, () => {
  console.log(`[serve] PID: ${process.pid}`)
  console.log(`[serve] Listening on http://${host}:${config.port}`)
})
server.on('error', (err) => {
  console.error('[serve:error]', err?.message || err)
})