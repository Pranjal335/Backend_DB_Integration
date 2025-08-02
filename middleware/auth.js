const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Please login first." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Check if token is blacklisted
    const blacklisted = await redisClient.get(`bl_${token}`);
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token Error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
