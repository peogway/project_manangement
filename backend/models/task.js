const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: String,
    created: String,
    priority: String,
    completed: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
});

taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
