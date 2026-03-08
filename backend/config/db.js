const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS to resolve MongoDB Atlas SRV records
// (fixes ISP DNS failing to resolve mongodb+srv:// addresses)
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("MongoDB Connected😉");
  } catch (err) {
    console.error("Error connecting to MongoDB😒", err);
    process.exit(1);
  }
};

module.exports = connectDB;
