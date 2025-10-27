import dbModel from '../model/db_model.js'

/** 
 * 获取日记分页
*/
export const getDiaryPage = async (req, res) => {
  try {
    let count = undefined
    const { pageSize = 10, nowPage = 1, serchTerm = '' } = req.body
    const result = await dbModel.getDiaryPage(Number(pageSize), Number(nowPage), serchTerm)
    if (req.body.count) {
      const countTemp = await dbModel.getDiaryCount(serchTerm)
      count = countTemp[0].count
    }
    if (result.length > 0) {
      for (const item of result) {
        const picture = item.picture ? JSON.parse(item.picture) : []
        item.picture = picture
      }
    }
    res.send({ code: 200, data: { count, list: result } })
  } catch (error) {
    console.error('getDiaryPage error:', error)
    res.send({ code: 500, message: '获取日记失败' })
  }
}

/**
 * 根据日记id删除日记
 */
export const deleteDiary = async (req, res) => {
  try {
    const { diaryId } = req.body
    await dbModel.deleteDiaryById(diaryId)
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteDiary error:', error)
    res.send({ code: 500, message: '删除失败' })
  }
}

/**
 * 新增日记
 */
export const insertDiary = async (req, res) => {
  try {
    const { value: { title, content, picture, weather_id, moment } } = req.body
    if (title == undefined || content == undefined || picture == undefined || weather_id == undefined || moment == undefined)
      return res.send({ code: 400, message: 'insertLabel参数错误' })
    const result = await dbModel.insertDiary({title, content, picture: JSON.stringify(picture), weather_id, moment})
    res.send({ code: 200, data: result.insertId })
  } catch (error) {
    console.error('insertDiary error:', error)
    res.send({ code: 500, message: '新增失败' })
  }
}

/**
 * 修改日记
 */
export const updateDiary = async (req, res) => {
  try {
    const { id, value: { title, content, picture, weather_id, moment } } = req.body
    if (id == undefined || title == undefined || content == undefined || picture == undefined || weather_id == undefined || moment == undefined)
      return res.send({ code: 400, message: 'updateDiary参数错误' })
    await dbModel.updateDiary(id, { title, content, picture: JSON.stringify(picture), weather_id, moment })
    res.send({ code: 200 })
  } catch (error) {
    console.error('updateDiary error:', error)
    res.send({ code: 500, message: '修改失败' })
  }
}

/**
 * 根据日记id返回日记数据
 */
export const getDiaryById = async (req, res) => {
  try {
    const { diaryId } = req.body
    const result = await dbModel.getDiaryById(Number(diaryId))
    res.send({ code: 200, data: result.length > 0 ? result[0] : {} })
  } catch (error) {
    console.error('getDiaryById error:', error)
    res.send({ code: 500, message: '获取日记失败' })
  }
}