require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");
const errorMiddleware = require("./middlewares/error.middleware");
const userRoutes = require("./modules/user/user.routes");
const contactRequestRoutes = require("./modules/contact/contact-request.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ success: true, message: "API Running..." });
});

const apiPrefix = "/api/v1";

app.use(`${apiPrefix}`, userRoutes);
app.use(`${apiPrefix}`, contactRequestRoutes);
app.use(`${apiPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorMiddleware);

module.exports = app;
exports = app;