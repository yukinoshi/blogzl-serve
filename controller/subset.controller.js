import dbModel from '../model/db_model.js'

/** 获取各种分类信息 */
export const getSubset = async (req, res) => {
  try {
    const { classify } = req.body
    if (classify === undefined)
      return res.send({ code: 400, message: 'getSubset参数错误' })
    const result = await dbModel.getSubset(classify)
    if (classify === 2) {
      for (const item in result) {
        const value = await dbModel.getFileCount(result[item].id)
        result[item].value = value[0].count
      }
    } else {
      for (const item in result) {
        const value = await dbModel.getArticleCount(-1, result[item].id, '', classify)
        result[item].value = value[0].count
      }
    }
    res.send({ code: 200, data: { count: result.length, list: result } })
  } catch (error) {
    console.error('getSubset error:', error)
    res.send({ code: 500, message: '获取分类信息失败' })
  }
}

/** 新建分类 */
export const insertSubset = async (req, res) => {
  try {
    const { value: { subset_name, classify, moment } } = req.body
    if (classify === undefined || subset_name === undefined || moment === undefined)
      return res.send({ code: 400, message: 'insertSubset参数错误' })
    const result = await dbModel.insertSubset({ subset_name, classify, moment })
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertSubset error:', error)
    res.send({ code: 500, message: '新建分类失败' })
  }
}

/** 根据subsetID修改分类名称 */
export const updateSubset = async (req, res) => {
  try {
    const { id, subset_name } = req.body
    if (id === undefined || subset_name === undefined)
      return res.send({ code: 400, message: 'updateSubset参数错误' })
    await dbModel.updateSubset(id, subset_name)
    res.send({ code: 200 })
  } catch (error) {
    console.error('updateSubset error:', error)
    res.send({ code: 500, message: '修改分类名称失败' })
  }
}

/** 根据subsetID删除分类 */
export const deleteSubset = async (req, res) => {
  try {
    const { id } = req.body
    if (id === undefined)
      return res.send({ code: 400, message: 'deleteSubset参数错误' })
    await dbModel.deleteSubsetById(id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteSubset error:', error)
    res.send({ code: 500, message: '删除分类失败' })
  }
}
