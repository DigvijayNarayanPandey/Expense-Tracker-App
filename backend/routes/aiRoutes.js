// Dedicated rate limiter for AI endpoint — separate from auth limiter.
// 20 req/min per IP is generous for chat but prevents abuse.

const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const { chat } = require("../controllers/aiController");

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI requests. Please slow down." },
});

// protect ensures user is authenticated; aiLimiter prevents API abuse
router.post("/chat", protect, aiLimiter, chat);

module.exports = router;
