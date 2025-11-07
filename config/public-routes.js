// 不需要验证 token 的接口路径列表
// 直接写路径（与 req.path 完全匹配）；如需更灵活可改成支持前缀/正则
export default [
  '/login',
  '/insertUser',
  '/isRegister',
  '/verify',
  '/visits',
  '/survey',
  '/recordVisit',
  '/banner',
  '/article',
  '/gainArticle',
  '/gainSubset',
]
