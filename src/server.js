const db = require("./db");
const express = require("express");
const { restaruntsRoutes } = require("./app/routes");

db.connectToDatabase();

const app = express();

app.use(express.json());
app.use("/restaurants", restaruntsRoutes);

app.listen(4000, () => console.log("Running Restaurants  API server"));
