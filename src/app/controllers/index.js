const { RestaruntsModal } = require("../../db");

const { CustomError } = require("restaurants-utils");

const { buildQueryForSearch, buildQueryForFilter } = require("./helpers");
const { updateRedisCache, invalidateRedisCache } = require("../routes/helpers");

const addNewRestaurant = async (req, res, next) => {
  try {
    const { body } = req;

    const record = new RestaruntsModal(body);
    const newRestarunt = await record.save();

    res.status(200).json(newRestarunt);
  } catch (error) {
    next(error);
  }
};

const updateRestaurant = async (req, res, next) => {
  const { id } = req.params;

  try {
    const restarunt = await RestaruntsModal.findById(id);

    if (!restarunt) {
      throw new CustomError(404, "restarunt not found ");
    }

    const { cuisine, menu, name, address, city } = req.body;

    const query = {
      ...(name && { name }),
      ...(address && { address }),
      ...(city && { city }),
      ...(cuisine && { $push: { cuisine: { $each: cuisine } } }),
      ...(menu && { $push: { menu: { $each: menu } } })
    };

    const updated = await RestaruntsModal.findByIdAndUpdate(id, query, { new: true, upsert: true });

    invalidateRedisCache(id);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const getRestaurants = async (req, res, next) => {
  try {
    let restaurants = null;
    const { search, offset, limit } = req.query;
    if (!search) {
      const count = await RestaruntsModal.count({});
      restaurants = await RestaruntsModal.find({}, null, { skip: +offset, limit: +limit });

      restaurants = { totalRecords: count, restaurants };
    } else {
      const inputQuery = buildQueryForSearch(search);
      restaurants = await RestaruntsModal.find(inputQuery);
    }

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};

const filterRestaurants = async (req, res, next) => {
  try {
    const inputQuery = buildQueryForFilter(req.body);

    const restaurants = await RestaruntsModal.find(inputQuery);
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};

const getRestaurantById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const restaurant = await RestaruntsModal.find({ _id: id });

    if (!restaurant.length) throw new CustomError(404, "Restaurant Not Found");

    updateRedisCache(id, restaurant);

    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewRestaurant,
  updateRestaurant,
  getRestaurants,
  filterRestaurants,
  getRestaurantById
};
