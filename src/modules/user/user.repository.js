const { Op } = require("sequelize");
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

async function findUserByEmailOrPhone(email, phoneNumber) {
    const where = [];

    if (email) where.push({ email });
    if (phoneNumber) where.push({ phoneNumber });

    if (!where.length) return null;

    return User.findOne({
        where: where.length === 1 ? where[0] : { [Op.or]: where },
    });
}

async function updateUser(user, payload) {
    return user.update(payload);
}

module.exports = {
    createUser,
    findUserById,
    findUserByPhone,
    findAllUsers,
    updateUser,
    deleteUser,
    findUserByEmailOrPhone,
};
