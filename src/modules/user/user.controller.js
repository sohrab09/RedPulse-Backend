const userService = require("./user.service");
const { successResponse } = require("../../utils/response");
const { sendVerificationEmail } = require("../../service/email.service");
const ApiError = require("../../utils/apiError");
const User = require("./user.model");

function generateVerificationCode() {  // ✅
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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

async function getPublicUsers(req, res, next) {
    try {
        const result = await userService.getPublicUsers(req.query);

        if (!result) throw new Error("Users not found");

        return successResponse({
            res,
            message: "Users retrieved successfully",
            data: result,
            status: 200
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

async function getMyProfile(req, res, next) {
    try {
        const user = await userService.getMyProfile(req.user.id);
        return successResponse({
            res,
            message: "Profile retrieved successfully",
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

async function sendVerificationEmailCode(req, res, next) {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        if (user.emailVerificationExpires && new Date() < new Date(user.emailVerificationExpires)) {
            const remaining = Math.ceil((new Date(user.emailVerificationExpires) - new Date()) / 1000 / 60);
            throw new ApiError(`Please wait ${remaining} minutes before requesting a new code`, 429);
        }

        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.update({
            emailVerificationCode: code,
            emailVerificationExpires: expiresAt,
        });

        await sendVerificationEmail(user.email, code);

        return successResponse({
            res,
            message: "Verification code sent to your email",
        });
    } catch (error) {
        next(error);
    }
}

// ✅ FIXED: Verify email with code
async function verifyEmail(req, res, next) {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        // Fetch actual Sequelize instance
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        if (!user.emailVerificationCode) {
            throw new ApiError("No verification code found. Please request a new one.", 400);
        }

        if (new Date(user.emailVerificationExpires) < new Date()) {
            throw new ApiError("Verification code expired. Please request a new one.", 400);
        }

        if (user.emailVerificationCode !== code) {
            throw new ApiError("Invalid verification code", 400);
        }

        await user.update({
            isEmailVerified: true,
            emailVerificationCode: null,
            emailVerificationExpires: null,
        });

        return successResponse({
            res,
            message: "Email verified successfully",
            data: { isEmailVerified: true },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    getPublicUsers,
    getUserById,
    getMyProfile,
    updateUser,
    deleteUser,
    login,
    updateAvailability,
    sendVerificationEmailCode,
    verifyEmail,
};
