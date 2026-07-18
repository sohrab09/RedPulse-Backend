const { Op } = require("sequelize");
const ContactRequest = require("./contact-request.model");

async function createContactRequest(payload) {
    return ContactRequest.create(payload);
}

async function findPendingRequest(senderId, receiverId) {
    return ContactRequest.findOne({
        where: {
            senderId,
            receiverId,
            status: "PENDING",
        },
    });
}

async function findRequestById(id) {
    return ContactRequest.findByPk(id);
}

async function findRequestsByReceiver(receiverId) {
    return ContactRequest.findAll({
        where: { receiverId },
        order: [["createdAt", "DESC"]],
    });
}

async function findRequestsBySender(senderId) {
    return ContactRequest.findAll({
        where: { senderId },
        order: [["createdAt", "DESC"]],
    });
}

async function updateRequest(request, payload) {
    return request.update(payload);
}

module.exports = {
    createContactRequest,
    findPendingRequest,
    findRequestById,
    findRequestsByReceiver,
    findRequestsBySender,
    updateRequest,
};