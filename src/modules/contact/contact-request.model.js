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
            references: { model: "users", key: "id" },
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
        status: {
            type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
            defaultValue: "PENDING",
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        hospitalName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hospitalAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bloodGroupNeeded: {
            type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
            allowNull: false,
            defaultValue: "O+",  // ✅ Add default
        },
        unitsNeeded: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: { min: 1, max: 10 },
        },
        urgency: {
            type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
            defaultValue: "MEDIUM",
        },
        patientName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        patientAge: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 0, max: 120 },
        },
        patientGender: {
            type: DataTypes.ENUM("Male", "Female", "Others"),
            allowNull: true,
        },
        reason: {
            type: DataTypes.ENUM("Surgery", "C-Section", "Accident", "Fracture", "Cancer", "Thalassemia", "Anemia", "Childbirth", "Other"),
            allowNull: false,
            defaultValue: "Other",
        },
        reasonOther: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        requiredDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [11, 15] },
        },
        additionalNotes: {
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