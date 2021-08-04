const redis = require("redis");
const { logger } = require("restaurants-utils");

let client = null;

connectRedisClient = () => {
  client = redis.createClient({ retry_strategy: (options) => options.attemt > 1 && undefined });

  client.on("error", (err) => logger.info(err));

  client.on("connect", function () {
    logger.info("Connected redis client");
  });
};

fetchFromRedisMW = (redisKey) => (req, res, next) => {
  let key = redisKey;

  if (!key) key = req.params.id;

  if (!client || !client.connected) {
    next();
    return;
  }

  client.get(key, (err, data) => {
    if (err) logger.error(err);

    if (data) {
      logger.info(`Fetched ${key} from redis`);
      res.status(200).json(JSON.parse(data));
      return;
    }

    next();
  });
};

updateRedisCache = (key, value) => {
  if (!client || !client.connected) {
    return;
  }

  client.setex(key, 30 * 60, JSON.stringify(value), (err) => {
    if (!err) logger.info(`Updated Redis cache with key ${key}`);
  });
};

invalidateRedisCache = (key) => {
  if (!client || !client.connected) {
    return;
  }

  client.del(key, function (err, reply) {
    if (!err) logger.info(`invalidated Redis cache with key ${key}`);
  });
};

module.exports = {
  connectRedisClient,
  fetchFromRedisMW,
  updateRedisCache,
  invalidateRedisCache
};
