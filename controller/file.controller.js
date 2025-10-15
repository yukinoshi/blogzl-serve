import dbModel from '../model/db_model.js'

/** 获取文件分页 */
export const getFilePage = async (req, res) => {
  try {
    let count = undefined
    const { pageSize = 10, nowPage = 1, subsetId = -1 } = req.body
    const result = await dbModel.getFilePage(Number(pageSize), Number(nowPage), Number(subsetId))
    if (req.body.count) {
      const countTemp = await dbModel.getFileCount(Number(subsetId))
      count = countTemp[0].count
    }
    res.send({ code: 200, data: { count, list: result } })
  } catch (error) {
    console.error('getFilePage error:', error)
    res.send({ code: 500, message: '获取文件失败' })
  }
}

/** 根据fileId移动文件分类 */
export const moveFileSubset = async (req, res) => {
  try {
    const { id, subsetId } = req.body
    if (id === undefined || subsetId === undefined)
      return res.send({ code: 400, message: 'moveFileSubset参数错误' })
    await dbModel.moveFileSubset(id, subsetId)
    res.send({ code: 200 })
  } catch (error) {
    console.error('moveFileSubset error:', error)
    res.send({ code: 500, message: '移动文件分类失败' })
  }
}
