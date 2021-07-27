const { RestaruntsModal } = require("../../db");

const { buildQueryForSearch, buildQueryForFilter } = require("./helpers");

const addNewRestaurant = async (req, res) => {
  try {
    const { body } = req;

    const record = new RestaruntsModal(body);
    const newRestarunt = await record.save();

    res.status(200).json(newRestarunt);
  } catch (error) {
    res.status(404).send({ message: error.toString() });
  }
};

const updateRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restarunt = await RestaruntsModal.findById(id);

    if (!restarunt) {
      res.status(404).json({ message: "restarunt not found " });
      return;
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

    res.status(200).json(updated);
  } catch (error) {
    res.status(404).send({ message: error.toString() });
  }
};

const getRestaurants = async (req, res) => {
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
    res.status(404).send({ message: error.toString() });
  }
};

const filterRestaurants = async (req, res) => {
  try {
    const inputQuery = buildQueryForFilter(req.query);

    const restaurants = await RestaruntsModal.find(inputQuery);
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(404).send({ message: error.toString() });
  }
};

const getRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurants = await RestaruntsModal.findById(id);
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(404).send({ message: error.toString() });
  }
};

module.exports = {
  addNewRestaurant,
  updateRestaurant,
  getRestaurants,
  filterRestaurants,
  getRestaurant
};
