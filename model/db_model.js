export { isRegister, insertUser, login } from './user.model.js'
export { getCommentPage, commentCount, commentIsread, getArticleTitleById, deleteCommentById } from './comment.model.js'
export { getMessagePage, getMessageCount, messageIsread, deleteMessageById, getUnreadMessageCount } from './message.model.js'
export { getArticlePage, getAllarticle, getAllArticleby, getArticleCount, changeArticleState, insertArticle, deleteArticleById, getArticleById, updateArticleById } from './article.model.js'
export { insertPraise, getPraiseCountByArticleId, getPraiseByUserIdAndArticleId, getPraiseByUserId, deletePraiseByUserId } from './praise.model.js'
export { getSubset, insertSubset, updateSubset, deleteSubsetById, getSubsetById } from './subset.model.js'
export { getLabel, insertLabel, deleteLabel } from './label.model.js'
export { getFileCount, getFilePage, moveFileSubset, insertFile, deleteFileById, getFileById } from './file.model.js'
export { getDiaryPage, deleteDiaryById, insertDiary, updateDiary, getDiaryById, getDiaryCount } from './diary.model.js'


import * as user from './user.model.js'
import * as comment from './comment.model.js'
import * as message from './message.model.js'
import * as article from './article.model.js'
import * as praise from './praise.model.js'
import * as subset from './subset.model.js'
import * as label from './label.model.js'
import * as file from './file.model.js'
import * as diary from './diary.model.js'


export default {
  ...user,
  ...comment,
  ...message,
  ...article,
  ...praise,
  ...subset,
  ...label,
  ...file,
  ...diary,
}