const contactRequestRepository = require("./contact-request.repository");
const userRepository = require("../user/user.repository");
const ApiError = require("../../utils/apiError");
const ContactRequest = require("./contact-request.model");

// ✅ ADD: cleanPayload function definition
function cleanPayload(payload) {
    const cleaned = {};
    for (const [key, value] of Object.entries(payload)) {
        cleaned[key] = value === "" ? null : value;
    }
    return cleaned;
}

// ❌ REMOVE this line: const cleaned = cleanPayload(payload);

async function createContactRequest(payload) {
    const {
        senderId,
        receiverId,
        message,
        hospitalName,
        hospitalAddress,
        bloodGroupNeeded,
        unitsNeeded,
        urgency,
        patientName,
        patientAge,
        patientGender,
        reason,
        reasonOther,
        requiredDate,
        contactNumber,
        additionalNotes,
    } = payload;

    if (!senderId) {
        throw new ApiError("Please register or login for sending a contact request", 400);
    }

    if (senderId === receiverId) {
        throw new ApiError("You cannot contact yourself", 400);
    }

    const receiver = await userRepository.findUserById(receiverId);
    if (!receiver) {
        throw new ApiError("Donor not found", 404);
    }
    if (!receiver.isAvailable) {
        throw new ApiError("Donor is currently unavailable", 400);
    }

    const existingRequest = await contactRequestRepository.findPendingRequest(
        senderId,
        receiverId
    );

    if (existingRequest) {
        throw new ApiError("You already have a pending request to this donor", 409);
    }

    // ✅ CORRECT: cleanPayload called here, inside function
    const cleaned = cleanPayload({
        message,
        hospitalName,
        hospitalAddress,
        bloodGroupNeeded,
        unitsNeeded,
        urgency,
        patientName,
        patientAge,
        patientGender,
        reason,
        reasonOther,
        requiredDate,
        contactNumber,
        additionalNotes,
    });

    const contactRequest = await contactRequestRepository.createContactRequest({
        senderId,
        receiverId,
        message: cleaned.message,
        hospitalName: cleaned.hospitalName,
        hospitalAddress: cleaned.hospitalAddress,
        bloodGroupNeeded: cleaned.bloodGroupNeeded,
        unitsNeeded: cleaned.unitsNeeded || 1,
        urgency: cleaned.urgency || "MEDIUM",
        patientName: cleaned.patientName,
        patientAge: cleaned.patientAge,
        patientGender: cleaned.patientGender,
        reason: cleaned.reason,
        reasonOther: cleaned.reasonOther,
        requiredDate: cleaned.requiredDate,
        contactNumber: cleaned.contactNumber,
        additionalNotes: cleaned.additionalNotes,
        status: "PENDING",
    });

    return contactRequest;
}

// ... rest same

async function getMyContactRequests(userId) {
    const requests = await ContactRequest.findAll({
        where: { receiverId: userId },
        include: [
            {
                model: require("../user/user.model"),
                as: "sender",
                attributes: ["id", "fullName", "bloodGroup", "phoneNumber", "district", "upazila", "age", "gender"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return requests;
}

async function getMySentRequests(userId) {
    const requests = await ContactRequest.findAll({
        where: { senderId: userId },
        include: [
            {
                model: require("../user/user.model"),
                as: "receiver",
                attributes: ["id", "fullName", "bloodGroup", "phoneNumber", "district", "upazila", "age", "gender"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return requests;
}

async function updateRequestStatus(requestId, userId, status) {
    const request = await contactRequestRepository.findRequestById(requestId);

    if (!request) {
        throw new ApiError("Request not found", 404);
    }
    if (request.receiverId !== userId) {
        throw new ApiError("Unauthorized to update this request", 403);
    }

    const updatedRequest = await contactRequestRepository.updateRequest(request, {
        status,
    });

    return updatedRequest;
}

module.exports = {
    createContactRequest,
    getMyContactRequests,
    getMySentRequests,
    updateRequestStatus,
};