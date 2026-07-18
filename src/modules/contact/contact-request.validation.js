const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const validReasons = ["Surgery", "C-Section", "Accident", "Fracture", "Cancer", "Thalassemia", "Anemia", "Childbirth", "Other"];
const validUrgencies = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function validateCreateContactRequest(body) {
    const errors = [];

    if (!body.receiverId) {
        errors.push("receiverId is required");
    } else if (typeof body.receiverId !== "string") {
        errors.push("receiverId must be a string");
    }

    // ✅ Blood group needed
    if (!body.bloodGroupNeeded) {
        errors.push("bloodGroupNeeded is required");
    } else if (!bloodGroups.includes(body.bloodGroupNeeded)) {
        errors.push("bloodGroupNeeded must be a valid blood group");
    }

    // ✅ Units needed
    if (body.unitsNeeded != null) {
        if (!Number.isInteger(body.unitsNeeded) || body.unitsNeeded < 1 || body.unitsNeeded > 10) {
            errors.push("unitsNeeded must be between 1 and 10");
        }
    }

    // ✅ Urgency
    if (body.urgency != null && !validUrgencies.includes(body.urgency)) {
        errors.push(`urgency must be one of: ${validUrgencies.join(", ")}`);
    }

    // ✅ Reason
    if (!body.reason) {
        errors.push("reason is required");
    } else if (!validReasons.includes(body.reason)) {
        errors.push(`reason must be one of: ${validReasons.join(", ")}`);
    }

    // ✅ Reason other
    if (body.reason === "Other" && !body.reasonOther) {
        errors.push("reasonOther is required when reason is Other");
    }

    // ✅ Required date
    if (body.requiredDate != null && isNaN(Date.parse(body.requiredDate))) {
        errors.push("requiredDate must be a valid date");
    }

    // ✅ Contact number
    if (body.contactNumber != null && !/^\+?[0-9]{11,15}$/.test(body.contactNumber)) {
        errors.push("contactNumber must be a valid phone number");
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