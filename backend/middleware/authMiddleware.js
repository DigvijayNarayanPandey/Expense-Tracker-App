const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  // Check if authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  // Check if authorization header starts with "Bearer "
  if (!req.headers.authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid token format" });
  }

  // Extract token
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
