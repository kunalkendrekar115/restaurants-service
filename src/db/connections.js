const mongoose = require("mongoose");

const dbUri = "mongodb+srv://kunalkmk:kunal12345@cluster0-v9tid.mongodb.net/foodorderdemo?retryWrites=true&w=majority";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDb Atlas");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDatabase;
