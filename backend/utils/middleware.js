const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

// Middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" }); // Respond with a 404 error
};

// Middleware to handle errors
const errorHandler = (error, request, response, next) => {
    logger.error(error.message); // Log the error message

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" }); // Handle invalid ID
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message }); // Handle validation errors
    } else if (
        error.name === "MongoServerError" &&
        error.message.includes("E11000 duplicate key error")
    ) {
        return response.status(400).json({
            error: "expected `username` to be unique", // Handle duplicate key errors
        });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token invalid" }); // Handle invalid tokens
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "token expired", // Handle expired tokens
        });
    }

    next(error); // Pass error to the next middleware
};

// Middleware to extract token from request headers
const tokenExtractor = (req, res, next) => {
    const authorization = req.get("Authorization"); // Get Authorization header
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        req.token = authorization.substring(7); // Extract token
    } else {
        req.token = null; // No token found
    }
    next(); // Proceed to the next middleware
};

// Middleware to extract user from token
const userExtractor = (req, res, next) => {
    if (req.token) {
        const decodedToken = jwt.verify(req.token, process.env.SECRET); // Verify and decode token
        if (!decodedToken.id) {
            req.user = null; // Invalid token
        } else {
            req.user = decodedToken; // Assign decoded token to req.user
        }
    } else {
        req.user = null; // No token provided
    }

    next(); // Proceed to the next middleware
};

// Export all middleware
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
