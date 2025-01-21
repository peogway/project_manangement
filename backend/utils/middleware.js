// Import logger and jwt for logging and token verification
const logger = require("./logger");
const jwt = require("jsonwebtoken");

// Middleware to log request details
const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method); // Log HTTP method
    logger.info("Path:  ", request.path); // Log request path
    logger.info("Body:  ", request.body); // Log request body
    logger.info("---"); // Separator for logs
    next(); // Proceed to the next middleware
};

// Middleware to handle unknown endpoints (404 error)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" }); // Respond with 404
};

// Middleware to handle various errors
const errorHandler = (error, request, response, next) => {
    logger.error(error.message); // Log error message

    // Handle specific types of errors
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" }); // Handle malformed ID
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message }); // Handle validation error
    } else if (
        error.name === "MongoServerError" &&
        error.message.includes("E11000 duplicate key error")
    ) {
        return response.status(400).json({
            error: "expected `username` to be unique", // Handle duplicate username error
        });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token invalid" }); // Handle invalid JWT
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "token expired", // Handle expired JWT
        });
    }

    next(error); // Pass error to the next middleware if not handled
};

// Middleware to extract the token from the Authorization header
const tokenExtractor = (req, res, next) => {
    const authorization = req.get("Authorization"); // Get Authorization header
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        req.token = authorization.substring(7); // Extract the token from "Bearer <token>"
    } else {
        req.token = null; // No token found
    }
    next(); // Proceed to the next middleware
};

// Middleware to extract user information from the token
const userExtractor = (req, res, next) => {
    if (req.token) {
        const decodedToken = jwt.verify(req.token, process.env.SECRET); // Verify and decode the token
        if (!decodedToken.id) {
            req.user = null; // Invalid token, no user data
        } else {
            req.user = decodedToken; // Set decoded token to req.user
        }
    } else {
        req.user = null; // No token provided
    }

    next(); // Proceed to the next middleware
};

// Export all the middleware for use in other parts of the application
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
