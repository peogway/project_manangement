// Load environment variables from a .env file
require("dotenv").config();

// Set the port value from the environment variable or fallback to a default
let PORT = process.env.PORT || 3001; // Default to 3000 if PORT is not set

// Define the MongoDB URI based on the environment
// If the environment is "test", use the test MongoDB URI, otherwise use the production one
const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI // URI for testing
    : process.env.MONGODB_URI; // URI for production

// Export the MongoDB URI and port for use in other parts of the application
module.exports = {
    MONGODB_URI,
    PORT,
};
