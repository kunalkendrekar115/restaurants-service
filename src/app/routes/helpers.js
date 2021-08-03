const { CustomError, logger } = require("restaurants-utils");
const yup = require("yup");

const redis = require("redis");
const client = redis.createClient();

const restaurantSchema = yup.object().shape({
  name: yup.string().required("Restaurant Name is Required"),
  address: yup.string().required("Restaurant Address is Required"),
  city: yup.string().required("Restaurant City is Required"),
  location: yup
    .object()
    .shape({
      lat: yup.number().required("latitude is required"),
      lng: yup.number().required("longitude is required")
    })
    .required("location is required"),
  cuisine: yup.array().of(yup.string()).min(1).required("atleast 1 cuisine is required"),
  menu: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Menu name is required"),
        price: yup.number().required("Meu price is required")
      })
    )
    .min(1)
    .required("min 1 menu item is required")
});

const validateResourceMW = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource, { abortEarly: false });
    next();
  } catch (e) {
    next(new CustomError(403, e.errors));
  }
};

fetchFromRedisMW = (redisKey) => (req, res, next) => {
  let key = redisKey;

  if (!key) key = req.params.id;

  client.get(key, (err, data) => {
    if (err) {
      logger.error(err);
      next(err);
      return;
    }
    if (data) {
      logger.info("Fetched from redis");
      res.status(200).json(JSON.parse(data));
      return;
    }

    next();
  });
};

updateRedisCache = (key, value) => {
  client.setex(key, 5 * 60, JSON.stringify(value), (err) => {
    if (!err) logger.info(`Updated Redis cache with key ${key}`);
  });
};

invalidateRedisCache = (key) => {
  client.del(key, function (err, reply) {
    if (!err) logger.info(`invalidated Redis cache with key ${key}`);
  });
};

module.exports = {
  restaurantSchema,
  validateResourceMW,
  fetchFromRedisMW,
  updateRedisCache,
  invalidateRedisCache
};
