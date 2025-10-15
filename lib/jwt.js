import jwt from "jsonwebtoken";

const secretKey = "ajdajdahn12430asnds";

const generateToken = (payload) => {
  //jwt 有效期1天
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  try {
    jwt.verify(token, secretKey);
    return 1
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error.message);
    } else {
      console.error("Token verification error:", error);
    }
    return 0
  }
};

export default {
  generateToken,
  verifyToken,
};
