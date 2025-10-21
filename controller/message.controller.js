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

/**
 * 删除私信
 */
export const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.body
    await dbModel.deleteMessageById(id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteMessageById error:', error)
    res.send({ code: 500, message: '删除私信失败' })
  }
}

/**
 * 获取未读的私信数量
 */
export const getUnreadMessageCount = async (req, res) => {
  try {
    const result = await dbModel.getUnreadMessageCount()
    res.send({ code: 200, data: { count: result[0].count } })
  } catch (error) {
    console.error('getUnreadMessageCount error:', error)
    res.send({ code: 500, message: '获取未读私信数量失败' })
  }
}