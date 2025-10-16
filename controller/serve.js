import * as user from './auth.controller.js'
import * as comment from './comment.controller.js'
import * as message from './message.controller.js'
import * as articl from './article.controller.js'
import * as praise from './praise.controller.js'
import * as subset from './subset.controller.js'
import * as label from './label.controller.js'
import * as file from './file.controller.js'
import * as diary from './diary.controller.js'
import * as overview from './overview.controller.js'

export default {
  ...user,
  ...comment,
  ...message,
  ...articl,
  ...praise,
  ...subset,
  ...label,
  ...file,
  ...diary,
  ...overview,
}
