// Define the info logging function
const info = (...params) => {
    // Only log if the environment is not "test"
    if (process.env.NODE_ENV !== "test") {
        console.log(...params); // Log the provided parameters to the console
    }
};

// Define the error logging function
const error = (...params) => {
    // Only log if the environment is not "test"
    if (process.env.NODE_ENV !== "test") {
        console.error(...params); // Log the provided parameters as error to the console
    }
};

// Export the info and error logging functions
module.exports = { info, error };
