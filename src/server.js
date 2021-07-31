const db = require("./db");
const express = require("express");
const { logger, errorHandler } = require("restaurants-utils");
const { restaruntsRoutes } = require("./app/routes");

db.connectToDatabase();

const app = express();

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const jsyaml = require("js-yaml");
const spec = fs.readFileSync("api.yaml", "utf8");
const swaggerDocument = jsyaml.load(spec);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/restaurants", restaruntsRoutes);
app.use(errorHandler);

app.listen(4000, () => logger.info("Running Restaurants  API Services on PORT 4000"));
