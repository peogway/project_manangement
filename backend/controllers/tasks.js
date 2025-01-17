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

module.exports = tasksRouter;
