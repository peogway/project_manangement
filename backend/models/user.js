// Import mongoose for schema and model creation
const mongoose = require("mongoose");

// Define the user schema
const userSchema = mongoose.Schema({
    name: String, // User's full name
    username: {
        type: String,
        required: true, // Username is required
        minLength: 3, // Minimum length of username is 3 characters
        unique: true, // Ensure username is unique in the database
    },
    passwordHash: { // Hash of the user's password
        type: String,
    },
    avatarUrl: String,
    email: String,
    gender: String,
    dateOfBirth: Date,
    phoneNumber: String,
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", // Reference to Project model (array of projects)
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", // Reference to Category model (array of categories)
        },
    ],
});

// Configure the JSON transformation of the schema
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convert _id to string and assign it to id
        delete returnedObject._id; // Remove _id field from the response
        delete returnedObject.__v; // Remove versioning field (__v) from the response
        delete returnedObject.passwordHash; // Do not expose passwordHash in the response
    },
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
