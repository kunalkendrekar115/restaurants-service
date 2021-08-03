const express = require("express");

const {
  addNewRestaurant,
  updateRestaurant,
  getRestaurants,
  filterRestaurants,
  getRestaurantById
} = require("../controllers");

const { restaurantSchema, validateResourceMW } = require("./helpers");

const router = express.Router();

router.post("/", validateResourceMW(restaurantSchema), addNewRestaurant);

router.patch("/:id", updateRestaurant);

router.get("/", getRestaurants);

router.post("/filter", filterRestaurants);

router.get("/:id", fetchFromRedisMW(), getRestaurantById);

module.exports = { router };
