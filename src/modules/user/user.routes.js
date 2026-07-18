const express = require("express");
const userController = require("./user.controller");
const auth = require("../../middlewares/Auth");
const validateRequest = require("../../middlewares/validate.middleware");
const updateLastSeen = require("../../middlewares/updateLastSeen");  // ✅ import
const { validateCreatePayload, validateUpdatePayload, validateAvailabilityPayload } = require("./user.validation");

const router = express.Router();

// Auth Routes
router.post("/auth/register", validateRequest(validateCreatePayload), userController.createUser);
router.post("/auth/login", userController.login);

// Public Donor Routes
router.get("/public/donors", updateLastSeen, userController.getPublicUsers);

// User Routes
router.get("/users/me/profile", auth, userController.getMyProfile);

router.patch("/users/me/availability", auth, updateLastSeen, validateRequest(validateAvailabilityPayload), userController.updateAvailability);

// Email verification routes
router.post("/users/me/send-verification", auth, userController.sendVerificationEmailCode);
router.post("/users/me/verify-email", auth, userController.verifyEmail);

router.get("/users/:id", auth, userController.getUserById);
router.patch("/users/:id", auth, validateRequest(validateUpdatePayload), userController.updateUser);
router.delete("/users/:id", auth, userController.deleteUser);

module.exports = router;