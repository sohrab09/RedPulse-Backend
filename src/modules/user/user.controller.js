const userService = require("./user.service");
const { successResponse } = require("../../utils/response");

async function createUser(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        return successResponse({
            res,
            status: 201,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

async function getUsers(req, res, next) {
    try {
        const result = await userService.getUsers(req.query);

        if (!result) throw new Error("Users not found");

        return successResponse({
            res,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        return successResponse({
            res,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        return successResponse({
            res,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.id);
        return successResponse({
            res,
            message: "User deleted successfully",
            data: {},
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const user = await userService.login(req.body);
        return successResponse({
            res,
            message: "Login successful",
            data: user,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

async function updateAvailability(req, res, next) {

    try {
        const user = await userService.updateAvailability(
            req.user.id,
            req.body
        );

        return successResponse({
            res,
            message: "Availability updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    updateAvailability
};
