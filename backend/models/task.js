const mongoose = require("mongoose");

// Define the Task schema
const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
        trim: true, // Trims leading/trailing spaces
    },
    description: {
        type: String,
        trim: true, // Trims leading/trailing spaces for description
    },
    status: String, // The status of the task (e.g., "in-progress", "completed")
    priority: String, // The priority of the task (e.g., "high", "low")
    completed: Boolean, // Whether the task is completed or not
    createAt: Date, // The date when the task was created
    dueDate: Date, // The due date for the task
    icon: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // Reference to the Project model
        required: true, // Task must belong to a project
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // Task must belong to a user
    },
});

// Configure how to return Task data in JSON format
taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convert _id to id
        delete returnedObject._id; // Remove the _id field
        delete returnedObject.__v; // Remove the __v field (version key)
    },
});

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
