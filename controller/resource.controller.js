import dbModel from '../model/db_model.js'

/** 获取资源分页 */
export const getResourcePage = async (req, res) => {
  try {
    const { pageSize = 8, nowPage = 1, subsetId = -2, serchTerm = '', count = true } = req.body;
    const result = await dbModel.getResourcePage(Number(pageSize), Number(nowPage), subsetId, serchTerm);
    let Numcount = undefined;
    if (count) {
      const countTemp = await dbModel.getResourceCount(subsetId, serchTerm);
      Numcount = countTemp[0].count
    }
    res.send({ code: 200, data: { count: Numcount || 0, list: result } });
  } catch (error) {
    console.error('getResourcePage error:', error);
    res.send({ code: 500, message: '获取资源失败' });
  }
}

/** 根据id删除资源 */
export const deleteResourceById = async (req, res) => {
  try {
    const { id } = req.body;
    await dbModel.deleteResourceById(id);
    res.send({ code: 200, message: '删除资源成功' });
  } catch (error) {
    console.error('deleteResourceById error:', error);
    res.send({ code: 500, message: '删除资源失败' });
  }
}

/** 根据id获取资源 */
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await dbModel.getResourceById(id);
    res.send({ code: 200, data: result[0] });
  } catch (error) {
    console.error('getResourceById error:', error);
    res.send({ code: 500, message: '获取资源失败' });
  }
}

/** 插入资源 */
export const insertResource = async (req, res) => {
  try {
    const { value: { title, subset_id, introduce, cover, password, format, url } } = req.body
    if (title == undefined || url == undefined || password == undefined || format == undefined)
      return res.send({ code: 400, message: 'insertArticle参数错误' })
    const data = {
      title,
      subset_id,
      introduce,
      cover,
      password,
      format,
      url
    }
    const res = await dbModel.insertResource(data);
    res.send({ code: 200, data: res.insertId });
  } catch (error) {
    console.error('insertResource error:', error);
    res.send({ code: 500, message: '插入资源失败' });
  }
}
/** 根据id修改资源 */
export const updateResourceById = async (req, res) => {
  try {
    const { id, value: { title, subset_id, introduce, cover, password, format, url } } = req.body;
    if (id == undefined || title == undefined || url == undefined || password == undefined || format == undefined)
      return res.send({ code: 400, message: 'updateResourceById参数错误' });
    const data = {
      title,
      subset_id,
      introduce,
      cover,
      password,
      format,
      url
    }
    const res = await dbModel.updateResourceById(id,data);
    res.send({ code: 200 });
  } catch (error) {
    console.error('updateResourceById error:', error);
    res.send({ code: 500, message: '更新资源失败' });
  }
}