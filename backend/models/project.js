const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: String,
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
    trasnform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject._v;
    },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
