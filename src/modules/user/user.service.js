const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("./user.repository");
const ApiError = require("../../utils/apiError");
const { getPagination, getPagingData } = require("../../utils/pagination");

async function createUser(payload) {
    const existing = await userRepository.findUserByPhone(payload.phoneNumber);
    if (existing) {
        throw new ApiError("Phone number already exists", 409);
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
    }

    return userRepository.createUser(payload);
}

async function getUsers(query) {
    const { page = 1, limit = 10, bloodGroup, division, district } = query;
    const { limit: pageLimit, offset, page: currentPage } = getPagination(page, limit);

    const where = {};
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (division) where.division = division;
    if (district) where.district = district;

    const users = await userRepository.findAllUsers({
        where,
        limit: pageLimit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return getPagingData(users, currentPage, pageLimit);
}

async function getUserById(id) {
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    return user;
}

async function updateUser(id, payload) {
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (payload.phoneNumber && payload.phoneNumber !== user.phoneNumber) {
        const existing = await userRepository.findUserByPhone(payload.phoneNumber);
        if (existing && existing.id !== id) {
            throw new ApiError("Phone number already exists", 409);
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
    }

    return userRepository.updateUser(user, payload);
}

async function deleteUser(id) {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) {
        throw new ApiError("User not found", 404);
    }

    return deleted;
}

async function login(payload) {
    if (!payload.email && !payload.phoneNumber) {
        throw new ApiError("Email or phone number is required", 400);
    }

    const user = await userRepository.findUserByEmailOrPhone(payload.email, payload.phoneNumber);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
        throw new ApiError("Invalid credentials", 401);
    }

    const safeUser = user.toJSON ? user.toJSON() : user;
    delete safeUser.password;

    const token = jwt.sign(
        { id: safeUser.id, email: safeUser.email, role: safeUser.role },
        process.env.JWT_SECRET || "redpulse-secret",
        { expiresIn: "7d" }
    );

    return { user: safeUser, token };
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
};
