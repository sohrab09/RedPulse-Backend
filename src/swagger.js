const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "RedPulse Blood Bank Management API",
        version: "1.0.0",
        description: "CRUD API for general users in the RedPulse blood bank management system.",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local development server",
        },
    ],
    components: {
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    fullName: { type: "string" },
                    age: { type: "integer", minimum: 18 },
                    bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
                    division: { type: "string" },
                    district: { type: "string" },
                    upazila: { type: "string" },
                    union: { type: "string" },
                    phoneNumber: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            CreateUserRequest: {
                type: "object",
                required: ["fullName", "age", "bloodGroup", "division", "district", "upazila", "union", "phoneNumber", "email", "password"],
                properties: {
                    fullName: { type: "string", minLength: 3 },
                    age: { type: "integer", minimum: 18 },
                    bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
                    division: { type: "string" },
                    district: { type: "string" },
                    upazila: { type: "string" },
                    union: { type: "string" },
                    phoneNumber: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string" },
                },
            },
            UpdateUserRequest: {
                type: "object",
                properties: {
                    fullName: { type: "string", minLength: 3 },
                    age: { type: "integer", minimum: 18 },
                    bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
                    division: { type: "string" },
                    district: { type: "string" },
                    upazila: { type: "string" },
                    union: { type: "string" },
                    phoneNumber: { type: "string" },
                },
            },
            ApiResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: ["object", "array", "null"] },
                    errors: { type: "array", items: { type: "object" } },
                },
            },
        },
        parameters: {
            page: { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            limit: { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
            bloodGroup: { name: "bloodGroup", in: "query", schema: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }, description: "Filter by blood group" },
            division: { name: "division", in: "query", schema: { type: "string" }, description: "Filter by division" },
            district: { name: "district", in: "query", schema: { type: "string" }, description: "Filter by district" },
        },
    },
    paths: {
        "/api/v1/users": {
            post: {
                summary: "Create a new user",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateUserRequest" },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User created successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiResponse" },
                            },
                        },
                    },
                    400: { description: "Validation error" },
                    409: { description: "Phone number already exists" },
                },
            },
            get: {
                summary: "Get all users",
                tags: ["Users"],
                parameters: [
                    { $ref: "#/components/parameters/page" },
                    { $ref: "#/components/parameters/limit" },
                    { $ref: "#/components/parameters/bloodGroup" },
                    { $ref: "#/components/parameters/division" },
                    { $ref: "#/components/parameters/district" },
                ],
                responses: {
                    200: {
                        description: "Users retrieved successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/api/v1/users/{id}": {
            get: {
                summary: "Get a single user by ID",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" },
                    },
                ],
                responses: {
                    200: {
                        description: "User retrieved successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiResponse" },
                            },
                        },
                    },
                    404: { description: "User not found" },
                },
            },
            patch: {
                summary: "Update an existing user",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateUserRequest" },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "User updated successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiResponse" },
                            },
                        },
                    },
                    400: { description: "Validation error" },
                    404: { description: "User not found" },
                    409: { description: "Phone number already exists" },
                },
            },
            delete: {
                summary: "Delete a user",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" },
                    },
                ],
                responses: {
                    200: {
                        description: "User deleted successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiResponse" },
                            },
                        },
                    },
                    404: { description: "User not found" },
                },
            },
        },
    },
};

module.exports = swaggerDocument;
