const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  name: "String",
  price: Number
});

const Menu = mongoose.model("ProductsModal", MenuSchema);

const restaruntSchema = new Schema({
  name: String,
  address: String,
  city: String,
  location: {
    lng: Number,
    lat: Number
  },
  cuisine: [String],
  menu: [Menu.schema]
});

module.exports = mongoose.model("RestaruntsModal", restaruntSchema, "restaurants");
