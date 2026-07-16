const { ValidationError, UniqueConstraintError } = require("sequelize");

function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || [];

    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        message = "Database validation failed";
        errors = err.errors.map((error) => ({ field: error.path, message: error.message }));
    }

    const isServerError = statusCode === 500 && !err.isOperational;
    if (isServerError) {
        // Hide internals in production, but always log for debugging
        console.error(err.stack || err);
        message = "Internal server error";
        errors = [];
    }

    const payload = {
        success: false,
        message,
        errors: errors.length ? errors : undefined,
        data: null,
    };

    // Include error details in non-production for easier debugging
    if (process.env.NODE_ENV !== "production") {
        payload._error = {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
    }

    return res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;
