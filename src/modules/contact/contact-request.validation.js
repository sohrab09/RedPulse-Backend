// contact-request.validation.js (No Joi required)

function validateCreateContactRequest(body) {
    const errors = [];

    if (!body.receiverId) {
        errors.push("receiverId is required");
    } else if (typeof body.receiverId !== "string") {
        errors.push("receiverId must be a string");
    }

    if (body.message && typeof body.message !== "string") {
        errors.push("message must be a string");
    }

    if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.errors = errors;
        throw error;
    }

    return true;
}

function validateUpdateStatus(body) {
    const errors = [];
    const validStatuses = ["ACCEPTED", "REJECTED"];

    if (!body.status) {
        errors.push("status is required");
    } else if (!validStatuses.includes(body.status)) {
        errors.push(`status must be one of: ${validStatuses.join(", ")}`);
    }

    if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.errors = errors;
        throw error;
    }

    return true;
}

module.exports = {
    validateCreateContactRequest,
    validateUpdateStatus,
};