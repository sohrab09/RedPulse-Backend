const User = require("../modules/user/user.model");
const ContactRequest = require("../modules/contact/contact-request.model");

function setupAssociations() {
    User.hasMany(ContactRequest, {
        foreignKey: "senderId",
        as: "sentRequests",
    });

    User.hasMany(ContactRequest, {
        foreignKey: "receiverId",
        as: "receivedRequests",
    });

    ContactRequest.belongsTo(User, {
        foreignKey: "senderId",
        as: "sender",
    });

    ContactRequest.belongsTo(User, {
        foreignKey: "receiverId",
        as: "receiver",
    });
}

module.exports = setupAssociations;