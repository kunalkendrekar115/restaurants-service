const { logger } = require("restaurants-utils");

const { RestaruntsModal } = require("../../db");
const queue_name = "rating_reviews_update";

const amqp = require("amqplib/callback_api");

let connection = null;
const connect = () => {
  amqp.connect(
    "amqps://hutlyloi:0M39C00k8_538qtCWNcPhCYe-uZtioOn@beaver.rmq.cloudamqp.com/hutlyloi",
    function (err, conn) {
      if (err != null) logger.error(err);
      logger.info("Connected Message Queue");
      connection = conn;

      listenForRatingsUpdate();
    }
  );
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

        logger.info("Ratings Updated");

        ch.ack(msg);
      }
    });
  });
}

module.exports = {
  publishMessage,
  connect
};
