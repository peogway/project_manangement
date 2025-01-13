const User = require("../models/user");
const Task = require("../models/task");
const Project = require("../models/project");
const Category = require("../models/category");

const projectsRouter = require("express").Router();

projectsRouter.get("/", async (req, res) => {
    const projects = await Project.find({}).populate("tasks", {
        id: 1,
        name: 1,
    })
        .populate("categories", { id: 1, name: 1 }).populate("user", {
            id: 1,
            name: 1,
            useranme: 1,
        });

    res.status(200).json(projects);
});

module.exports = projectsRouter;
