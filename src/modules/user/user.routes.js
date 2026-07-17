const express = require("express");
const userController = require("./user.controller");
const auth = require("../../middlewares/Auth");
const validateRequest = require("../../middlewares/validate.middleware");
const { validateCreatePayload, validateUpdatePayload } = require("./user.validation");

const router = express.Router();

router.post("/", validateRequest(validateCreatePayload), userController.createUser);
router.post("/login", userController.login);
router.get("/", userController.getUsers);
router.get("/:id", auth, userController.getUserById);
router.patch("/:id", auth, validateRequest(validateUpdatePayload), userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
