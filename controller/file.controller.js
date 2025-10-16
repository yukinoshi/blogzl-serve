import { format } from 'mysql'
import dbModel from '../model/db_model.js'
import { deleteFiles } from '../lib/file.js'
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

/** 上传单文件 */
export const uploadFile = async (req, res) => {
  try {
    const file = req.file
    let subsetId = undefined
    if (!file) {
      return res.send({ code: 400, message: 'No file uploaded' })
    }
    if (req.body.subsetId) {//如果有分类id
      subsetId = req.body.subsetId
    }
    const type = file.originalname.split('.').pop()
    const filename = file.filename
    let data = {
      url: `/files/${filename}`,
      file_name: filename,
      format: type,
      moment: Date.now(),
      subset_id: subsetId
    }
    const result = await dbModel.insertFile(data)
    res.send({
      code: 200,
      data: {
        ...data,
        id: result.insertId
      }
    })
  } catch (error) {
    console.error('uploadFile error:', error)
    res.send({ code: 500 })
  }
}

/**
 * 根据文件id删除文件
 */
export const deleteFileById = async (req, res) => {
  try {
    let { filesId } = req.body
    //把JSON字符串转换为数组
    if (typeof filesId !== 'number' && filesId != undefined) {
      filesId = JSON.parse(filesId)
    } else if (filesId === undefined) {
      return res.send({ code: 400, message: 'deleteFileById参数错误' })
    }
    //删除数据库中的记录
    const result = await dbModel.getFileById(filesId)
    if (result.length > 0 && result.length > 1) {//批量删除文件
      dbModel.deleteFileById(result.map(item => item.id))
    } else if (result.length == 1) {//删除单个文件
      dbModel.deleteFileById(result[0].id)
    } else {
      return res.send({ code: 404, message: '文件不存在' })
    }
    //删除服务器上的文件
    if (result.length > 0 && result.length > 1) {//批量删除文件
      deleteFiles(result.map(item => item.url))
    } else if (result.length == 1) {//删除单个文件
      deleteFiles(result[0].url)
    }
    res.send({ code: 200 })
  } catch (error) {
    console.error('deleteFileById error:', error)
    res.send({ code: 500, message: '删除文件失败' })
  }
}