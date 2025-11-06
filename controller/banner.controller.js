import dbModel from '../model/db_model.js'

/** 获取轮播图列表 */
export const getBannerImages = async (req, res) => {
  try {
    const images = await dbModel.getBannerImages()
    res.send({ code: 200, data: images })
  } catch (error) {
    console.error('getBannerImages error:', error)
    res.send({ code: 500, message: '获取轮播图列表失败' })
  }
}
