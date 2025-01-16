const User = require("../models/user");
const Task = require("../models/task");
const Project = require("../models/project");
const Category = require("../models/category");

const projectsRouter = require("express").Router();

projectsRouter.get("/", async (req, res) => {
    const userRequest = req.user;
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
    const user = await User.findById(userRequest.id);

    const project = new Project({
        ...body,
        created: now.toString(),
        user: user.id,
    });
    const savedProject = await project.save();

    user.projects = user.projects.concat(savedProject.id);
    await user.save();

    const populatedProject = await savedProject.populate([
        { path: "tasks", select: "id name" },
        { path: "categories", select: "id name" },
        { path: "user", select: "id name username" },
    ]);

    await Promise.all(
        body.categories.map(async (category) => {
            const foundCategory = await Category.findById(category);
            foundCategory.projects = foundCategory.projects.concat(
                savedProject.id,
            );
            await foundCategory.save();
        }),
    );

    return res.status(201).json(populatedProject);
});

projectsRouter.get("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).json({ errror: "invalid project" });

    if (project.user !== userRequest.id) {
        return res.status(403).json({ error: "Only owner can access project" });
    }

    const populatedProject = await project.populate([
        { path: "tasks", select: "id name" },
        { path: "categories", select: "id name" },
        { path: "user", select: "id name username" },
    ]);
    return res.json(populatedProject);
});

module.exports = projectsRouter;
