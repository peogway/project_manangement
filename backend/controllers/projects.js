// Import required models
const User = require("../models/user");
const Task = require("../models/task");
const Project = require("../models/project");
const Category = require("../models/category");

// Create a new router instance
const projectsRouter = require("express").Router();

// GET all projects for a user
projectsRouter.get("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const projects = await Project.find({ user: userRequest.id }).populate([
        { path: "tasks" },
        { path: "categories" },
        { path: "user", select: "id name username" },
    ]);

    res.status(200).json(projects);
});

// POST a new project
projectsRouter.post("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const body = req.body;
    if (!("name" in body)) {
        return res.status(400).json({ error: "empty project name" });
    }

    const now = new Date();
    const user = await User.findById(userRequest.id);

    const project = new Project({
        ...body,
        createAt: now,
        user: user.id,
        completeAt: now,
    });
    const savedProject = await project.save();

    user.projects = user.projects.concat(savedProject.id);
    await user.save();

    const populatedProject = await savedProject.populate([
        { path: "tasks" },
        { path: "categories" },
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

    res.status(201).json(populatedProject);
});

// GET a specific project by ID
projectsRouter.get("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).json({ error: "invalid project" });

    if (project.user.toString() !== userRequest.id) {
        return res.status(403).json({ error: "Only owner can access project" });
    }

    const populatedProject = await project.populate([
        { path: "tasks" },
        { path: "categories" },
        { path: "user", select: "id name username" },
    ]);

    res.json(populatedProject);
});

// DELETE a project by ID
projectsRouter.delete("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).json({ error: "invalid project" });

    if (project.user.toString() !== userRequest.id) {
        return res.status(403).json({ error: "Only owner can delete project" });
    }

    await Project.findByIdAndDelete(req.params.id);

    const user = await User.findById(userRequest.id);
    user.projects = user.projects.filter(
        (prj) => prj.toString() !== req.params.id.toString(),
    );

    await Promise.all(
        project.tasks.map(async (taskId) => {
            await Task.findByIdAndDelete(taskId);
        }),
        project.categories.map(async (cateId) => {
            const category = await Category.findById(cateId);
            if (!category) return;
            category.projects = category.projects.filter(
                (prjId) => prjId.toString() !== project.id.toString(),
            );
            await category.save();
        }),
    );

    await user.save();
    res.status(204).end();
});

// PUT (update) a project by ID
projectsRouter.put("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).json({ error: "invalid project" });

    if (project.user.toString() !== userRequest.id) {
        return res.status(403).json({ error: "Only owner can edit project" });
    }

    const body = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        body,
        { new: true },
    );

    const originalTasks = project.tasks;
    const updatedTasks = updatedProject.tasks;
    const addedTasks = updatedTasks.filter(
        (task) => !originalTasks.includes(task.toString()),
    );
    const removedTasks = originalTasks.filter(
        (task) => !updatedTasks.includes(task.toString()),
    );

    const originalCategories = project.categories;
    const updatedCategories = updatedProject.categories;
    const addedCategories = updatedCategories.filter(
        (category) => !originalCategories.includes(category.toString()),
    );
    const removedCategories = originalCategories.filter(
        (category) => !updatedCategories.includes(category.toString()),
    );

    await Promise.all(
        removedTasks.map(async (taskId) => {
            const task = await Task.findById(taskId);
            task.projects = task.projects.filter(
                (prjId) => prjId.toString() !== project.id.toString(),
            );
            await task.save();
        }),
        addedTasks.map(async (taskId) => {
            const task = await Task.findById(taskId);
            task.projects = task.projects.concat(project.id);
            await task.save();
        }),
        removedCategories.map(async (cateId) => {
            const category = await Category.findById(cateId);
            category.projects = category.projects.filter(
                (prjId) => prjId.toString() !== project.id.toString(),
            );
            await category.save();
        }),
        addedCategories.map(async (cateId) => {
            const category = await Category.findById(cateId);
            category.projects = category.projects.concat(project.id);
            await category.save();
        }),
    );

    res.status(204).end();
});

// Export the router
module.exports = projectsRouter;
