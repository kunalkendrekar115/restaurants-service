const db = require("./db")
const express = require("express")
const restaurantsRoutes = require("./app/routes/restaurants")

db.connectToDatabase()

const app = express()

app.use("/restaurants", restaurantsRoutes)

app.listen(4000)

console.log("Running  API server")