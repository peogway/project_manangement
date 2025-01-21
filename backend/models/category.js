const mongoose = require("mongoose");

// Define the Category schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
        trim: true, // Trims leading/trailing spaces
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // User is required
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", // Reference to the Project model
        },
    ],
});

// Configure how to return Category data in JSON format
categorySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convert _id to id
        delete returnedObject._id; // Remove the _id field
        delete returnedObject.__v; // Remove the __v field (version key)
    },
});

// Create and export the Category model
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
