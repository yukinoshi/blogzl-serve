import mysql from 'mysql'
import config from '../config/default.js'

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
})
//统一执行sql的函数
let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}
//连接数据库
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Database connected successfully!')
    connection.release()
  }
})

export { query, pool }
export default { query, pool }

