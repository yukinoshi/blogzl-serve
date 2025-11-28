import jwt from "jsonwebtoken";

const accessSecretKey = "ajdajdahn12430asnds";
const refreshSecretKey = "refresh_ajdajdahn12430asnds";

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const generateToken = (payload) => {
  // 短期 token，默认 1 小时
  return jwt.sign(payload, accessSecretKey, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

const generateRefreshToken = (payload) => {
  // 长期 token，默认 7 天
  return jwt.sign(payload, refreshSecretKey, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

const verifyToken = (token) => {
  // 返回解码后的 payload；无效或过期会抛出异常，交由上层捕获
  return jwt.verify(token, accessSecretKey);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshSecretKey);
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
