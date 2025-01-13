// Import mongoose for schema and model creation
const mongoose = require("mongoose");

// Define the user schema
const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true, // Ensure username is unique
    },
    passwordHash: { // Corrected key name
        type: String,
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    ],
});

// Configure the JSON transformation of the schema
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convert _id to string and assign to id
        delete returnedObject._id; // Remove _id field
        delete returnedObject.__v; // Remove __v field
        delete returnedObject.passwordHash; // Do not expose passwordHash
    },
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
