import multer from "multer";
import fs from 'fs'
import path from 'path'
//随机数方法
const random = (min, max) => Math.round(Math.random() * (max - min) + min)
const storage = multer.diskStorage({//配置上传目录和文件名
  destination: function (req, file, cb) {
    cb(null, './data/files')
  },
  filename: function (req, file, cb) {
    const name = Date.now() + random(1, 9999) + '.' + file.originalname.split('.').pop();
    cb(null, name)
  }
})

const deleteFiles = (url) => {
  if (typeof url == 'string') {//单个删除
    const filePath = path.join(process.cwd(), 'data', url)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err)
      }
    })
  } else if (Array.isArray(url)) {//批量删除
    url.forEach(u => {
      const filePath = path.join(process.cwd(), 'data', u)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err)
        }
      })
    })
  }
}


const upload = multer({ storage: storage })

export { upload as multer, deleteFiles }
