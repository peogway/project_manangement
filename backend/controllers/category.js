// Import necessary models
const User = require("../models/user");
const Category = require("../models/category");
const Project = require("../models/project");

// Create a new router instance
const categoriesRouter = require("express").Router();

// GET all categories for a user
categoriesRouter.get("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const categories = await Category.find({ user: userRequest.id }).populate([
        { path: "user", select: "id name username" },
        { path: "projects", select: "id name status" },
    ]);
    res.status(200).json(categories);
});

// POST a new category
categoriesRouter.post("/", async (req, res) => {
    const body = req.body;

    if (!("name" in body)) {
        return res.status(400).json({
            error: "category's name must not be empty",
        });
    }

    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
    }

    const foundCategory = await Category.findOne({
        name: body.name,
        user: userRequest.id,
    });
    if (foundCategory) {
        return res.status(400).json({ error: "category must be unique" });
    }

    const user = await User.findById(userRequest.id);

    const category = new Category({
        ...body,
        user: user.id,
    });

    const savedCategory = await category.save();
    user.categories = user.categories.concat(savedCategory.id);
    await user.save();
    const populatedCategory = await savedCategory.populate([
        { path: "user", select: "id name username" },
        { path: "projects", select: "id name status" },
    ]);

    await Promise.all(
        category.projects.map(async (prjId) => {
            const foundProject = await Project.findById(prjId);
            if (!foundProject) return;

            foundProject.categories = foundProject.categories.concat(
                category.id,
            );

            await foundProject.save();
        }),
    );

    res.status(201).json(populatedCategory);
});

// GET a specific category by ID
categoriesRouter.get("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "invalid token" });

    const category = await Category.findById(req.params.id).populate([
        { path: "user", select: "id name username" },
        { path: "projects", select: "id name status" },
    ]);

    if (!category) return res.status(400).json({ error: "invalid category" });
    if (category.user.id.toString() !== userRequest.id) {
        return res.status(403).json({
            error: "Only owner can access category",
        });
    }
    res.json(category);
});

// DELETE a category by ID
categoriesRouter.delete("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(400).json({ error: "category does not exist" });
    }
    if (category.user.toString() !== userRequest.id.toString()) {
        return res.status(403).json({
            error: "Only creator can delete category",
        });
    }

    await Promise.all(
        category.projects.map(async (projectId) => {
            const foundProject = await Project.findById(projectId);

            if (foundProject) {
                foundProject.categories = foundProject?.categories.filter(
                    (cateId) => cateId.toString() !== category._id.toString(),
                );
            }

            await foundProject.save();
        }),
    );

    await Category.findByIdAndDelete(req.params.id);

    const user = await User.findById(userRequest.id);
    user.categories = user.categories.filter(
        (cate) => cate.toString() !== req.params.id.toString(),
    );

    await user.save();

    res.status(204).end();
});

// PUT (update) a category by ID
categoriesRouter.put("/:id", async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "token invalid" });
    }

    const category = await Category.findById(req.params.id);
    if (category.user.toString() !== user.id.toString()) {
        return res.status(403).json({
            error: "Only creator can edit category",
        });
    }

    const editedCategory = {
        name: req.body.name,
        projects: req.body.projects,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        editedCategory,
        {
            new: true,
        },
    );

    const originalProjectIds = category.projects;
    const updatedProjectIds = updatedCategory.projects;
    const addedProjectIds = updatedProjectIds.filter((prjId) =>
        !originalProjectIds.includes(prjId.toString())
    );
    const removedProjectIds = originalProjectIds.filter((prjId) =>
        !updatedProjectIds.includes(prjId.toString())
    );

    await Promise.all(
        addedProjectIds.map(async (prjId) => {
            const project = await Project.findById(prjId);
            if (!project) return;

            project.categories = project.categories.concat(category.id);
            await project.save();
        }),
        removedProjectIds.map(async (prjId) => {
            const project = await Project.findById(prjId);
            if (!project) return;

            project.categories = project.categories.filter((cateId) =>
                cateId.toString() !== category.id.toString()
            );
            await project.save();
        }),
    );

    res.status(204).end();
});

// Export the router
module.exports = categoriesRouter;
