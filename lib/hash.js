import bcrypt from 'bcryptjs'


// 密码哈希（用于注册时存储哈希）
const hashPassword = (plain) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, 10, (err, hashed) => {
      if (err) return reject(err)
      resolve(hashed)
    })
  })
}

// 密码比对（用于登录时验证）
const comparePassword = (plain, hashed) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hashed, (err, same) => {
      if (err) return reject(err)
      resolve(same)
    })
  })
}
export default { hashPassword, comparePassword }