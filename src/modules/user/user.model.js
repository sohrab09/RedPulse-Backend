const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 100],
            },
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 18,
            },
        },
        bloodGroup: {
            type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
            allowNull: false,
        },
        division: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        upazila: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        union: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [11, 15],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 255],
            },
        },
        role: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            defaultValue: "USER",
        },
    },
    {
        tableName: "users",
        underscored: true,
        timestamps: true,
    }
);

module.exports = User;
