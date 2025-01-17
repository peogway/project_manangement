const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: String,
    priority: String,
    completed: Boolean,
    creatAt: Date,
    dueDate: Date,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        require: true,
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
