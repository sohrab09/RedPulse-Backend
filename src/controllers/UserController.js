const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { successResponse } = require("../utils/response");

function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    const userData = user.toJSON ? user.toJSON() : user;
    const { password, ...safeUser } = userData;

    return safeUser;
}

exports.register = async (req, res, next) => {
    try {
        const {
            fullName,
            age,
            gender,
            bloodGroup,
            division,
            district,
            upazila,
            union,
            phoneNumber,
            email,
            password,
            role,
        } = req.body;

        const requiredFields = [fullName, age, gender, bloodGroup, division, district, upazila, union, phoneNumber, email, password];
        if (requiredFields.some((field) => field == null || field === "")) {
            throw new ApiError("All required fields must be provided", 400);
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ApiError("Email already exists", 409);
        }

        const existingPhone = await User.findOne({ where: { phoneNumber } });
        if (existingPhone) {
            throw new ApiError("Phone number already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            age: Number(age),
            gender,
            bloodGroup,
            division,
            district,
            upazila,
            union,
            phoneNumber,
            email,
            password: hashedPassword,
            role: role === "ADMIN" ? "ADMIN" : "USER",
        });

        return successResponse({
            res,
            status: 201,
            message: "User registered successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError("Email and password are required", 400);
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError("Invalid credentials", 401);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new ApiError("JWT secret is not configured", 500);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });

        return successResponse({
            res,
            message: "Login successful",
            data: {
                token,
                user: sanitizeUser(user),
            },
        });
    } catch (error) {
        next(error);
    }
};