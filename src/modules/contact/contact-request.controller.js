const contactRequestService = require("./contact-request.service");
const { successResponse } = require("../../utils/response");

async function createContactRequest(req, res, next) {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        const request = await contactRequestService.createContactRequest(
            senderId,
            receiverId,
            message
        );

        return successResponse({
            res,
            status: 201,
            message: "Contact request sent successfully",
            data: request,
        });
    } catch (error) {
        next(error);
    }
}

async function getMyContactRequests(req, res, next) {
    try {
        const requests = await contactRequestService.getMyContactRequests(req.user.id);

        return successResponse({
            res,
            message: "Contact requests retrieved successfully",
            data: requests,
        });
    } catch (error) {
        next(error);
    }
}

async function getMySentRequests(req, res, next) {
    try {
        const requests = await contactRequestService.getMySentRequests(req.user.id);

        return successResponse({
            res,
            message: "Sent requests retrieved successfully",
            data: requests,
        });
    } catch (error) {
        next(error);
    }
}

async function updateRequestStatus(req, res, next) {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const request = await contactRequestService.updateRequestStatus(
            requestId,
            req.user.id,
            status
        );

        return successResponse({
            res,
            message: `Request ${status.toLowerCase()} successfully`,
            data: request,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createContactRequest,
    getMyContactRequests,
    getMySentRequests,
    updateRequestStatus,
};