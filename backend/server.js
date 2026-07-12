require("dotenv").config();

// Warn early if GROQ_API_KEY is missing — AI features will fail at runtime
if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️  GROQ_API_KEY is missing in .env. AI chat features will not work.");
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// In development the Vite proxy handles cross-origin — CORS is only needed
// for the production frontend. Set CLIENT_URL in .env to your deployed frontend URL.
const corsOptions = {
  origin: process.env.CLIENT_URL || false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth requests. Please try again after some time.",
  },
});

// Middleware to handle CORS
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

app.use("/api/v1", (req, res, next) => {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  next();
});

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ai", aiRoutes);

// Server uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "1d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
  }),
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
