// Import required models
const Project = require("../models/project");
const Task = require("../models/task");

// Create a new router instance
const tasksRouter = require("express").Router();

// GET all tasks for a specific project
tasksRouter.get("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const tasks = await Task.find({ user: userRequest.id }).populate(
        "project",
        "id name categories user icon",
    );

    if (
        tasks.length > 0 && tasks[0].project.user.toString() !== userRequest.id
    ) {
        return res.status(403).json({
            error: "only owner can access tasks",
        });
    }

    res.status(200).json(tasks);
});

// POST a new task to a specific project
tasksRouter.post("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const { projectId } = req.query;
    const body = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ error: "invalid project id" });

    if (project.user.toString() !== userRequest.id) {
        return res.status(403).json({
            error: "only project owner can add task",
        });
    }

    const task = new Task({
        ...body,
        status: "in-progress",
        completed: false,
        createAt: new Date(),
        project: project.id,
        description: body.description === "" ? null : body.description,
        dueDate: body.dueDate && !isNaN(new Date(body.dueDate))
            ? new Date(body.dueDate)
            : null,
        user: userRequest.id,
    });

    const savedTask = await task.save();
    const populatedTask = await savedTask.populate(
        "project",
    );

    project.tasks = project.tasks.concat(savedTask.id);
    await project.save();
    await Project.findByIdAndUpdate(project.id, { completeAt: null }, {
        new: true,
    });

    res.status(201).json(populatedTask);
});

// GET a specific task by ID
tasksRouter.get("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const task = await Task.findById(req.params.id).populate(
        "project",
        "id name categories user",
    );
    if (!task) return res.status(400).json({ error: "invalid task" });

    if (task.project.user.toString() !== userRequest.id) {
        return res.status(403).json({
            error: "only project owner can access task",
        });
    }

    res.status(200).json(task);
});

// DELETE a specific task by ID
tasksRouter.delete("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(400).json({ error: "invalid task id" });

    const project = await Project.findById(task.project).populate("tasks");

    if (project && project.user.toString() !== userRequest.id) {
        return res.status(403).json({
            error: "only project owner can delete task",
        });
    }

    await Task.findByIdAndDelete(req.params.id);

    if (project) {
        project.tasks = project.tasks.filter(
            (task) => task._id.toString() !== req.params.id,
        );
        const uncompletedTasks = project.tasks.filter((task) =>
            !task.completed && task._id.toString() !== req.params.id
        );
        if (uncompletedTasks.length === 0) {
            project.completeAt = new Date();
        }
        await project.save();
    }

    res.status(204).end();
});

// UPDATE a specific task by ID
tasksRouter.put("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(400).json({ error: "invalid task id" });

    const project = await Project.findById(task.project).populate("tasks");
    if (project && project.user.toString() !== userRequest.id) {
        return res.status(403).json({
            error: "only project owner can edit task",
        });
    }

    const uncompletedTasks = project.tasks.filter((task) => !task.completed);
    const completeAt = {
        completeAt: uncompletedTasks.length === 1 &&
                uncompletedTasks[0].id.toString() === req.params.id &&
                (req.body.completed ||
                    req.body.project !== task.project.toString())
            ? new Date()
            : null,
    };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).populate("project");

    await Project.findByIdAndUpdate(task.project, completeAt, { new: true });
    await Project.findByIdAndUpdate(req.body.project, { completeAt: null }, {
        new: true,
    });

    res.status(200).json(updatedTask);
});

// Export the router
module.exports = tasksRouter;
