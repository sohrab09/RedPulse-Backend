const ApiError = require("../utils/apiError");

function validateRequest(validator) {
    return (req, res, next) => {
        const errors = validator(req.body);
        if (errors && errors.length > 0) {
            return next(new ApiError("Validation failed", 400, errors));
        }

        next();
    };
}

module.exports = validateRequest;
