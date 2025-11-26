import Redis from 'ioredis'
import config from '../config/default.js'

const redis = new Redis({
  port: config.RedisConfig.redis.port,
  host: config.RedisConfig.redis.host,
  password: config.RedisConfig.redis.password,
  db: 1, // 默认使用 1 号数据库
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

redis.on('connect', () => {
  console.log('Redis connected successful')
})

redis.on('error', (err) => {
  console.error('Redis connected error:', err)
})

export default redis
