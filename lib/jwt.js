import jwt from "jsonwebtoken";

const secretKey = "ajdajdahn12430asnds";

const generateToken = (payload) => {
  //jwt 有效期1天
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  // 返回解码后的 payload；无效或过期会抛出异常，交由上层捕获
  return jwt.verify(token, secretKey);
};

export default {
  generateToken,
  verifyToken,
};
