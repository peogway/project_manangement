const User = require("../models/user");
const Task = require("../models/task");
const Project = require("../models/project");
const Category = require("../models/category");

const projectsRouter = require("express").Router();

projectsRouter.get("/", async (req, res) => {
    const userRequest = req.userRequest;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });
    const projects = await Project.find({ user: userRequest.id }).populate(
        "tasks",
        "id name",
    )
        .populate("categories", { id: 1, name: 1 }).populate(
            "user",
            "id name username",
        );

    res.status(200).json(projects);
});

projectsRouter.post("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
    }

    const body = req.body;
    if (!("name" in body)) {
        return res.status(400).json({ error: "empty project name" });
    }

    const now = new Date();
    const user = await User.findOne({ id: userRequest.id });

    const project = new Project({
        ...body,
        created: now.toString(),
        tasks: [],
        user: user.id,
    });
    const savedProject = await project.save();

    user.projects = user.projects.concat(savedProject.id);
    await user.save();

    const populatedProject = await savedProject.populate("tasks", "id name")
        .populate("categories", { id: 1, name: 1 }).populalte(
            "user",
            "id name",
        );
    return res.status(201).json(populatedProject);
});

module.exports = projectsRouter;
