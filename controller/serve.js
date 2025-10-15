import { isRegister, insertUser, login } from './auth.controller.js'
import { getCommentPage, commentCount } from './comment.controller.js'
import { getMessagePage } from './message.controller.js'
import { getArticlePage, getArticleById, changeArticleState, insertArticle, deleteArticle,updateArticleById, getArticleByState } from './article.controller.js'
import { insertPraise, deletePraiseByUserId } from './praise.controller.js'
import { getSubset, insertSubset, updateSubset, deleteSubset } from './subset.controller.js'
import { getLabel, insertLabel, deleteLabel } from './label.controller.js'
import { getFilePage, moveFileSubset } from './file.controller.js'
import { getDiaryPage, deleteDiary, insertDiary, updateDiary, getDiaryById } from './diary.controller.js'

export default {
  isRegister,
  insertUser,
  login,
  getCommentPage,
  commentCount,
  getMessagePage,
  getArticlePage,
  changeArticleState,
  deleteArticle,
  getArticleByState,
  getArticleById,
  updateArticleById,
  insertArticle,
  insertPraise,
  deletePraiseByUserId,
  getSubset,
  insertSubset,
  updateSubset,
  deleteSubset,
  getLabel,
  insertLabel,
  deleteLabel,
  getFilePage,
  moveFileSubset,
  getDiaryPage,
  deleteDiary,
  insertDiary,
  updateDiary,
  getDiaryById,
}
