// Import necessary modules and configurations
const config = require("./utils/config");
const express = require("express");
const cors = require('cors')
const path = require('path'); // Path module for handling file paths

require("express-async-errors"); // Handle async errors automatically
const app = express();

// Import routers and utilities
const usersRouter = require("./controllers/users"); // User-related routes
const loginRouter = require("./controllers/login"); // Login-related routes
const categoriesRouter = require("./controllers/category"); // Categories routes
const tasksRouter = require("./controllers/tasks"); //Tasks routes

const middleware = require("./utils/middleware"); // Middleware functions
const logger = require("./utils/logger"); // Logger utility
const mongoose = require("mongoose"); // MongoDB ORM
const projectsRouter = require("./controllers/projects");
const profileRouter = require("./controllers/profile");

// Set Mongoose configuration
mongoose.set("strictQuery", false);

// Log MongoDB connection attempt
logger.info("connecting to", config.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB"); // Log successful connection
    })
    .catch((error) => {
        logger.error("error connection to MongoDb:", error.message); // Log connection error
    });

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.static("dist")); // Serve static files from "dist" directory
app.use(express.json()); // Parse incoming JSON requests
app.use(middleware.tokenExtractor); // Extract token from requests

// Route handlers
// Catch-all route to serve index.html for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use("/profile", middleware.userExtractor, profileRouter);
app.use("/api/projects", middleware.userExtractor, projectsRouter);
app.use("/api/categories", middleware.userExtractor, categoriesRouter);
app.use("/api/tasks", middleware.userExtractor, tasksRouter);
app.use("/api/users", usersRouter); // Routes for user operations
app.use("/login", loginRouter); // Routes for login operations

app.use("/uploads", express.static("uploads"));

// Enable testing routes in test environment
// if (process.env.NODE_ENV === "test") {
//   const testingRouter = require("./controllers/testing");
//   app.use("/api/testing", testingRouter);
// }

app.use(middleware.unknownEndpoint); // Handle requests to unknown endpoints
app.use(middleware.errorHandler); // Handle application errors

// Export the app for use in other modules
module.exports = app;
