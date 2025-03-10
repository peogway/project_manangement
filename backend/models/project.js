const mongoose = require("mongoose");

// Define the Project schema
const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
        trim: true, // Trims leading/trailing spaces
    },
    createAt: Date, // Date when the project was created
    completeAt: Date, // Date when the project was created
    icon: String, // Optional icon for the project
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task", // Reference to the Task model
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", // Reference to the Category model
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model (project owner)
        required: true, // User is required
    },
});

// Configure how to return Project data in JSON format
projectSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convert _id to id
        delete returnedObject._id; // Remove the _id field
        delete returnedObject.__v; // Remove the __v field (version key)
    },
});

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
