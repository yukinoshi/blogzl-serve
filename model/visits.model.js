import db from './db.js'
const { query } = db

/** 插入一条访问记录 */
export const insertVisit = (visit) => {
  let sql = 'INSERT INTO visits (visit_time, ip) VALUES (?, ?);'
  return query(sql, [visit.visit_time, visit.ip])
}

/** 统计访问总数，支持按时间筛选 如果有时间 */
export const getVisitCount = (fromTime) => {
  if (fromTime) {
    // 统计从 fromTime（包含）到 fromTime + 1 day（不包含）之间的访问量
    const sql = 'SELECT COUNT(*) AS count FROM visits WHERE visit_time >= ? AND visit_time < DATE_ADD(?, INTERVAL 1 DAY);'
    return query(sql, [fromTime, fromTime])
  }
  // 不传时间则统计所有记录数
  const sql = 'SELECT COUNT(*) AS count FROM visits;'
  return query(sql)
}

/** 获取一周内每天的访问次数或者一个月内每天的访问次数 */
export const getVisitsStats = (fromTime) => {
  const sql = `SELECT DATE(visit_time) AS date, COUNT(*) AS count FROM visits WHERE visit_time >= ? GROUP BY DATE(visit_time) ORDER BY DATE(visit_time) ASC;`
  return query(sql, [fromTime])
}