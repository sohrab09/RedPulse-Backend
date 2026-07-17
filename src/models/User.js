const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 18,
            },
        },
        gender: {
            type: DataTypes.ENUM("Male", "Female", "Others"),
            allowNull: false,
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