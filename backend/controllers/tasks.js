const Project = require("../models/project");
const Task = require("../models/task");

const tasksRouter = require("express").Router();

tasksRouter.get("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const { projectId } = req.query;
    const tasks = await Task.find({ project: projectId }).populate(
        "project",
        "id name categories user",
    );
    if (tasks.length() > 0) {
        if (tasks[0].project.user !== userRequest.id.toString()) {
            return res.status(403).json({
                error: "only owner can access tasks",
            });
        }
    }

    res.status(200).json(tasks);
});

tasksRouter.post("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const { projectId } = req.query;
    const body = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ error: "invalid project id" });

    if (project.user !== userRequest.id.toString()) {
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
    });

    const savedTask = await task.save();
    const populatedTask = await savedTask.populate(
        "project",
        "id name categories",
    );

    project.tasks = project.tasks.concat(savedTask.id);
    await project.save();

    res.status(201).json(populatedTask);
});

tasksRouter.get("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const task = await Task.findById(req.params.id).populate(
        "project",
        "id name categories user",
    );
    if (!task) return res.status(400).json({ error: "invalid task" });
    if (task.project.user !== userRequest.id.toString()) {
        return res.status(403).json({
            error: "only project owner can access task",
        });
    }

    res.status(200).json(task);
});

tasksRouter.delete("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const { projectId } = req.query;
    const project = await Project.findById(projectId);
    if (project && project.user !== userRequest.id.toString()) {
        return res.status(403).json({
            error: "only project owner can delete task",
        });
    }

    await Task.findByIdAndDelete(req.params.id);
    project.tasks = project.tasks.filter((task) => task.id !== req.params.id);
    await project.save();
    res.status(204).end();
});

tasksRouter.put("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const { projectId } = req.query;
    const project = await Project.findById(projectId);
    if (project && project.user !== userRequest.id.toString()) {
        return res.status(403).json({
            error: "only project owner can edit task",
        });
    }

    await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
});

module.exports = tasksRouter;
