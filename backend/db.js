const mongoose = require('mongoose');

const URI = "mongodb://localhost:27017/iNotebook"; // add database name

const connectMongo = async () => {
  try {
    await mongoose.connect(URI)
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectMongo;
