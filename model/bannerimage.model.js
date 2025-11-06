import db from './db.js'
const { query } = db

export const getBannerImages = async () => {
  const sql = 'SELECT * FROM banner_image'
  const results = await query(sql)
  return results
}