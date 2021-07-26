const mongoose = require("mongoose")

const Schema = mongoose.Schema

const restaruntSchema = new Schema({
    name: String,
    address: String,
    city: String,
    location: {
        lng: Number,
        lat: Number
    },
    menu: [{
        id: Number,
        name: "String",
        price: Number
    }]

})

module.exports = mongoose.model("RestaruntsModal", restaruntSchema, "restaurants")
