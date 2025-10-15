import dbModel from '../model/db_model.js'

/** 获取私信分页 */
export const getMessagePage = async (req, res) => {
  try {
    let count = undefined
    const { pageSize = 10, nowPage = 1 } = req.body
    const result = await dbModel.getMessagePage(Number(pageSize), Number(nowPage))
    if (req.body.count) {
      const countTemp = await dbModel.getMessageCount()
      count = countTemp[0].count
    }
    if (result.length > 0) {
      for (const item of result) {
        if (item.isread === 0) {
          await dbModel.messageIsread(item.id)
          item.isread = 1
        }
      }
    }
    res.send({ code: 200, data: { count, list: result } })
  } catch (error) {
    console.error('getMessagePage error:', error)
    res.send({ code: 500, message: '获取私信失败' })
  }
}
