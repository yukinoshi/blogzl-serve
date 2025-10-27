import dbModel from '../model/db_model.js'
import { calculateDirectorySize } from '../lib/file.js'
/**
 * 获取总览数据
 */
export const getOverview = async (req, res) => {
  try {
    const articlecount = await dbModel.getArticleCount({classify: 0});
    const gallery = await dbModel.getArticleCount({classify: 1});
    const file = await calculateDirectorySize(process.cwd() + '/data/files');
    const diary = await dbModel.getDiaryCount();
    let fileSize = '';
    if((file/1024/1024)<1) {//如果数据小于1MB
      fileSize = (file/1024).toFixed(2) + 'KB';
    } else {//如果数据大于等于1MB
      fileSize = (file/1024/1024).toFixed(2) + 'MB';
    }
    const data = {
      article: articlecount[0].count,
      gallery: gallery[0].count,
      file: fileSize,
      diary: diary[0].count
    }
    res.json({ code: 200, data });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    res.send({ code: 500, message: '获取总览数据失败' });

  }
}
