const express = require("express");

const {
  addNewRestaurant,
  updateRestaurant,
  getRestaurants,
  filterRestaurants,
  getRestaurant
} = require("../controllers");

const router = express.Router();

router.post("/", addNewRestaurant);

router.patch("/:id", updateRestaurant);

router.get("/", getRestaurants);

router.get("/filter", filterRestaurants);

router.get("/:id", getRestaurant);

module.exports = { router };
