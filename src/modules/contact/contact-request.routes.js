// contact-request.routes.js
const express = require("express");
const contactRequestController = require("./contact-request.controller");
const auth = require("../../middlewares/Auth");

const router = express.Router();

// Custom validation middleware
const validateCreateContactRequest = (req, res, next) => {
    try {
        const { validateCreateContactRequest: validate } = require("./contact-request.validation");
        validate(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

const validateUpdateStatus = (req, res, next) => {
    try {
        const { validateUpdateStatus: validate } = require("./contact-request.validation");
        validate(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

// Send contact request to a donor
router.post(
    "/contact-requests",
    auth,
    validateCreateContactRequest,
    contactRequestController.createContactRequest
);

// Get incoming requests (notifications for donor)
router.get(
    "/contact-requests/incoming",
    auth,
    contactRequestController.getMyContactRequests
);

// Get sent requests
router.get(
    "/contact-requests/sent",
    auth,
    contactRequestController.getMySentRequests
);

// Update request status (accept/reject)
router.patch(
    "/contact-requests/:requestId/status",
    auth,
    validateUpdateStatus,
    contactRequestController.updateRequestStatus
);

module.exports = router;