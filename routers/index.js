import serve from "../controller/serve.js"
import {multer} from '../lib/file.js'

export default (app) => {

  app.get('/', (req, res) => res.send('Hello World!'))
  //验证是否注册
  app.post('/isRegister', (req, res) => {
    serve.isRegister(req, res)
  })
  //注册
  app.post('/insertUser', (req, res) => {
    serve.insertUser(req, res)
  })
  //登录
  app.post('/login', (req, res) => {
    serve.login(req, res)
  })

  app.get('/verify', (req, res) => {
    serve.verify(req, res)
  })

  app.post('/comment', (req, res) => {
    serve.getCommentPage(req, res)
  })

  app.post('/commentCount', (req, res) => {
    serve.commentCount(req, res)
  })

  app.post('/message', (req, res) => {
    serve.getMessagePage(req, res)
  })

  app.post('/article', (req, res) => {
    serve.getArticlePage(req, res)
  })

  app.post('/changeArticleState', (req, res) => {
    serve.changeArticleState(req, res)
  })

  app.post('/deleteArticle', (req, res) => {
    serve.deleteArticle(req, res)
  })

  app.post('/articleState', (req, res) => {
    serve.getArticleByState(req, res)
  })

  app.post('/gainArticle', (req, res) => {
    serve.getArticleById(req, res)
  })

  app.post('/updateArticle', (req, res) => {
    serve.updateArticleById(req, res)
  })

  app.post('/createArticle', (req, res) => {
    serve.insertArticle(req, res)
  })

  app.post('/addPraise', (req, res) => {
    serve.insertPraise(req, res)
  })

  app.post('/deletePraise', (req, res) => {
    serve.deletePraiseByUserId(req, res)
  })

  app.post('/subset', (req, res) => {
    serve.getSubset(req, res)
  })

  app.post('/addSubset', (req, res) => {
    serve.insertSubset(req, res)
  })

  app.post('/updateSubset', (req, res) => {
    serve.updateSubset(req, res)
  })

  app.post('/deleteSubset', (req, res) => {
    serve.deleteSubset(req, res)
  })

  app.post('/label', (req, res) => {
    serve.getLabel(req, res)
  })

  app.post('/addLabel', (req, res) => {
    serve.insertLabel(req, res)
  })

  app.post('/deleteLabel', (req, res) => {
    serve.deleteLabel(req, res)
  })

  app.post('/file', (req, res) => {
    serve.getFilePage(req, res)
  })

  app.post('/removeFile', (req, res) => {
    serve.moveFileSubset(req, res)
  })

  app.post('/deleteFile', (req, res) => {
    serve.deleteFileById(req, res)
  })

  app.post('/upload', multer.single('file'), (req, res) => {
    serve.uploadFile(req, res, multer)
  })

  app.post('/diary', (req, res) => {
    serve.getDiaryPage(req, res)
  })

  app.post('/deleteDiary', (req, res) => {
    serve.deleteDiary(req, res)
  })

  app.post('/createDiary', (req, res) => {
    serve.insertDiary(req, res)
  })

  app.post('/updateDiary', (req, res) => {
    serve.updateDiary(req, res)
  })

  app.post('/gainDiary', (req, res) => {
    serve.getDiaryById(req, res)
  })

  app.post('/overview', (req, res) => {
    serve.getOverview(req, res)
  })
}


