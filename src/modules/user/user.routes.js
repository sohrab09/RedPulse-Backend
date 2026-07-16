const express = require("express");
const userController = require("./user.controller");
const validateRequest = require("../../middlewares/validate.middleware");
const { validateCreatePayload, validateUpdatePayload } = require("./user.validation");

const router = express.Router();

router.post("/", validateRequest(validateCreatePayload), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", validateRequest(validateUpdatePayload), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
