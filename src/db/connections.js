const mongoose = require("mongoose");
const { logger } = require("restaurants-utils");

const dbUri = process.env.DB_CONNECTION;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info("Connected to MongoDb Atlas");
  } catch (error) {
    logger.error(error);
  }
};

module.exports = connectToDatabase;
