// middlewares/authMiddleware.js
module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
      next(); // User is authenticated, continue to route
    } else {
      res.status(401).json({ message: "Unauthorized. Please login first." });
    }
  };