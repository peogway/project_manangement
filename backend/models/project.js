const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    created: String,
    icon: String,
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

projectSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
