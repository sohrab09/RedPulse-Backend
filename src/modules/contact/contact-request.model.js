const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ContactRequest = sequelize.define(
    "ContactRequest",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        status: {
            type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
            defaultValue: "PENDING",
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "contact_requests",
        underscored: true,
        timestamps: true,
    }
);

module.exports = ContactRequest;