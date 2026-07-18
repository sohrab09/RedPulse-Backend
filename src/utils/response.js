function successResponse({ res, status = 200, message, data }) {
    return res.status(status).json({
        success: true,
        message,
        data,
        status,
    });
}

module.exports = { successResponse };
