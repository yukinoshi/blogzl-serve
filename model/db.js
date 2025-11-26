import mysql from 'mysql'
import config from '../config/default.js'
const Mysqlconfig = config.Mysqlconfig
const pool = mysql.createPool({
  connectionLimit: 10,
  host: Mysqlconfig.database.HOST,
  user: Mysqlconfig.database.USERNAME,
  password: Mysqlconfig.database.PASSWORD,
  database: Mysqlconfig.database.DATABASE
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

