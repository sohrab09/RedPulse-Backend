const User = require("./user.model");

async function createUser(payload) {
    return User.create(payload);
}

async function findUserById(id) {
    return User.findByPk(id);
}

async function findUserByPhone(phoneNumber) {
    return User.findOne({ where: { phoneNumber } });
}

async function findAllUsers(options) {
    return User.findAndCountAll(options);
}

async function updateUser(user, payload) {
    return user.update(payload);
}

async function deleteUser(id) {
    return User.destroy({ where: { id } });
}

module.exports = {
    createUser,
    findUserById,
    findUserByPhone,
    findAllUsers,
    updateUser,
    deleteUser,
};
