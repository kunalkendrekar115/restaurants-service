const express = require("express");

const {
  addNewRestaurant,
  updateRestaurant,
  getRestaurants,
  filterRestaurants,
  getRestaurantById
} = require("../controllers");

const router = express.Router();

router.post("/", addNewRestaurant);

router.patch("/:id", updateRestaurant);

router.get("/", getRestaurants);

router.post("/filter", filterRestaurants);

router.get("/:id", getRestaurantById);

module.exports = { router };
