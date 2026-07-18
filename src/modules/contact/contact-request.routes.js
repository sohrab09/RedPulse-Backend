const express = require("express");
const contactRequestController = require("./contact-request.controller");
const auth = require("../../middlewares/Auth");
const rateLimiter = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

// Send contact request - rate limit first, then auth
router.post(
    "/contact-requests",
    rateLimiter, // Applies to everyone (IP-based)
    auth,        // Then check auth (401 if no token)
    contactRequestController.createContactRequest
);

// Get incoming requests - auth required
router.get(
    "/contact-requests/incoming",
    auth,
    contactRequestController.getMyContactRequests
);

// Get sent requests - auth required
router.get(
    "/contact-requests/sent",
    auth,
    contactRequestController.getMySentRequests
);

// Update request status - auth required
router.patch(
    "/contact-requests/:requestId/status",
    auth,
    contactRequestController.updateRequestStatus
);

module.exports = router;