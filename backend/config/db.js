const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS to resolve MongoDB Atlas SRV records
// (fixes ISP DNS failing to resolve mongodb+srv:// addresses)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if already established
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    console.log("Connecting to MongoDB...");
    cachedConnection = await mongoose.connect(process.env.MONGODB_URL, {
      // Connection pool settings for better performance
      maxPoolSize: 10, // Maximum number of sockets
      minPoolSize: 2, // Maintain at least 2 connections
      maxIdleTimeMS: 30000, // Close idle connections after 30s
      serverSelectionTimeoutMS: 5000, // Fail fast if server unavailable
    });
    console.log("MongoDB Connected😉");
    return cachedConnection;
  } catch (err) {
    console.error("Error connecting to MongoDB😒", err);
    process.exit(1);
  }
};

module.exports = connectDB;
