const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const phoneRegex = /^\+?[0-9]{10,15}$/;
const validGenders = ["Male", "Female", "Other"];  // ✅ exact case

function isString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validateCreatePayload(body) {
    const errors = [];

    if (!isString(body.fullName) || body.fullName.trim().length < 3) {
        errors.push({ field: "fullName", message: "fullName is required and must be at least 3 characters" });
    }

    if (!Number.isInteger(body.age) || body.age < 18) {
        errors.push({ field: "age", message: "age is required and must be an integer of 18 or older" });
    }

    if (!bloodGroups.includes(body.bloodGroup)) {
        errors.push({ field: "bloodGroup", message: "bloodGroup is required and must be a valid blood group" });
    }

    if (!isString(body.division)) {
        errors.push({ field: "division", message: "division is required" });
    }

    if (!isString(body.district)) {
        errors.push({ field: "district", message: "district is required" });
    }

    if (!isString(body.upazila)) {
        errors.push({ field: "upazila", message: "upazila is required" });
    }

    if (!isString(body.union)) {
        errors.push({ field: "union", message: "union is required" });
    }

    if (!isString(body.phoneNumber) || !phoneRegex.test(body.phoneNumber)) {
        errors.push({ field: "phoneNumber", message: "phoneNumber is required and must be a valid phone format" });
    }

    if (!isString(body.gender) || !validGenders.includes(body.gender)) {
        errors.push({ field: "gender", message: "gender is required and must be Male, Female, or Other" });
    }

    return errors;
}

function validateUpdatePayload(body) {
    const errors = [];
    const hasFields = Object.keys(body).length > 0;

    if (!hasFields) {
        errors.push({ field: "body", message: "At least one field must be provided for update" });
        return errors;
    }

    if (body.fullName != null) {
        if (!isString(body.fullName) || body.fullName.trim().length < 3) {
            errors.push({ field: "fullName", message: "fullName must be at least 3 characters" });
        }
    }

    if (body.age != null) {
        if (!Number.isInteger(body.age) || body.age < 18) {
            errors.push({ field: "age", message: "age must be an integer of 18 or older" });
        }
    }

    if (body.bloodGroup != null) {
        if (!bloodGroups.includes(body.bloodGroup)) {
            errors.push({ field: "bloodGroup", message: "bloodGroup must be a valid blood group" });
        }
    }

    if (body.division != null && !isString(body.division)) {
        errors.push({ field: "division", message: "division must be a valid string" });
    }

    if (body.district != null && !isString(body.district)) {
        errors.push({ field: "district", message: "district must be a valid string" });
    }

    if (body.upazila != null && !isString(body.upazila)) {
        errors.push({ field: "upazila", message: "upazila must be a valid string" });
    }

    if (body.union != null && !isString(body.union)) {
        errors.push({ field: "union", message: "union must be a valid string" });
    }

    if (body.gender != null) {
        if (!isString(body.gender) || !validGenders.includes(body.gender)) {
            errors.push({ field: "gender", message: "gender must be Male, Female, or Other" });
        }
    }

    if (body.phoneNumber != null && !phoneRegex.test(body.phoneNumber)) {
        errors.push({ field: "phoneNumber", message: "phoneNumber must be a valid phone format" });
    }

    return errors;
}

function validateAvailabilityPayload(body) {
    const errors = [];

    if (typeof body.isAvailable !== "boolean") {
        errors.push({
            field: "isAvailable",
            message: "isAvailable is required and must be a boolean",
        });
    }

    return errors;
}

module.exports = {
    bloodGroups,
    validateCreatePayload,
    validateUpdatePayload,
    validateAvailabilityPayload
};