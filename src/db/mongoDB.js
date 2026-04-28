require("dotenv").config();
const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_URL, MONGO_DB, MONGO_OPTIONS } =
      process.env;

    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DB}?${MONGO_OPTIONS}`,
    );
    console.log("connected to the database");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};
module.exports = mongoDB;
