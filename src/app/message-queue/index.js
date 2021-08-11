const { logger } = require("restaurants-utils");

const { RestaruntsModal } = require("../../db");

const queue_name = "rating_reviews_update";
const amqp = require("amqplib/callback_api");

const { invalidateRedisCache } = require("../redis-cache");

let connection = null;
const connect = () => {
  amqp.connect(process.env.RABIT_MQ, function (err, conn) {
    if (err != null) logger.error(err);
    logger.info("Connected Message Queue");
    connection = conn;

    listenForRatingsUpdate();
  });
};

function publishMessage(rating_update) {
  connection.createChannel((err, ch) => {
    if (err != null) {
      logger.error(err);
      return;
    }
    ch.assertQueue(queue_name);
    ch.sendToQueue(queue_name, Buffer.from(JSON.stringify(rating_update)));
    logger.info(`message published ${JSON.stringify(rating_update)}`);
  });
}

// listenForRatingsUpdate
function listenForRatingsUpdate() {
  connection.createChannel((err, ch) => {
    if (err != null) {
      logger.error(err);
      return;
    }
    ch.assertQueue(queue_name);
    ch.consume(queue_name, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const { restaurantId, avgRating, totalRatings } = JSON.parse(content);

        const updated = await RestaruntsModal.findByIdAndUpdate(
          restaurantId,
          { avgRating, totalRatings },
          {
            new: true,
            upsert: true,
            useFindAndModify: false
          }
        );

        logger.info(`Ratings Updated for ${restaurantId}`);

        invalidateRedisCache(restaurantId);

        ch.ack(msg);
      }
    });
  });
}

module.exports = {
  publishMessage,
  connect
};
