import dbModel from '../model/db_model.js'

/** 获取label标签 */
export const getLabel = async (req, res) => {
  try {
    const result = await dbModel.getLabel()
    res.send({ code: 200, data: result })
  } catch (error) {
    console.error('getLabel error:', error)
    res.send({ code: 500, message: '获取标签信息失败' })
  }
}

/** 新建label标签 */
export const insertLabel = async (req, res) => {
  try {
    const { value: { label_name, moment } } = req.body
    if (label_name === undefined || moment === undefined)
      return res.send({ code: 400, message: 'insertLabel参数错误' })
    const result = await dbModel.insertLabel({ label_name, moment })
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertLabel error:', error)
    res.send({ code: 500, message: '新建标签失败' })
  }
}

/** 根据labelId删除label标签 */
export const deleteLabel = async (req, res) => {
  try {
    const { label_id } = req.body
    if (label_id === undefined)
      return res.send({ code: 400, message: 'deleteLabel参数错误' })
    await dbModel.deleteLabel(label_id)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteLabel error:', error)
    res.send({ code: 500, message: '删除标签失败' })
  }
}
