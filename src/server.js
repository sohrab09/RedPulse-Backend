require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connection established");

        await sequelize.sync({ alter: true });
        console.log("Table created/updated successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
    }
}

startServer();
