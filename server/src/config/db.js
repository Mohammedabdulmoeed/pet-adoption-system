const mongoose = require("mongoose");

async function connectDb(uri) {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri);

    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = { connectDb };