const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "signed out",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken.userId) {
      // this will add userId to req object so that the next functions can access it
      req.userId = decodedToken.userId;
      next();
    }
  } catch (e) {
    return res.status(403).json({
      message: "invalid token"
    });
  }
}


module.exports = { authMiddleware }