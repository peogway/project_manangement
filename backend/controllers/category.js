const User = require("../models/user");
const Category = require("../models/category");
const Project = require("../models/project");

const categoriesRouter = require("express").Router();

categoriesRouter.get("/", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) return res.status(401).json({ error: "token invalid" });

    const categories = await Category.find({ user: userRequest.id }).populate(
        "projects",
        {
            id: 1,
            name: 1,
            status: 1,
        },
    ).populate(
        "user",
        {
            id: 1,
            name: 1,
            username: 1,
        },
    );
    res.status(200).json(categories);
});

categoriesRouter.post("/", async (req, res) => {
    const body = req.body;

    if (!("name" in body)) {
        res.status(400).json({ error: "category's name must not be empty" })
            .end();
        return;
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
        projects: [],
        user: user.id,
    });

    const savedCategory = await category.save();
    user.categories = user.categories.concat(savedCategory.id);
    await user.save();
    const populatedCategory = await Category.findById(savedCategory.id)
        .populate(
            "user",
            {
                id: 1,
                name: 1,
                username: 1,
            },
        ).populate("projects", {
            id: 1,
            name: 1,
        });

    res.status(201).json(populatedCategory);
});

categoriesRouter.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id).populate(
        "projects",
        {
            id: 1,
            name: 1,
        },
    ).populate("user", {
        id: 1,
        name: 1,
        username: 1,
    });
    res.json(category);
});

categoriesRouter.delete("/:id", async (req, res) => {
    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(400).json({ error: "category does not exist" });
    }
    if (!(category.user.toString() === userRequest.id.toString())) {
        return res.status(403).json({
            error: "Only creator can delete category",
        });
    }

    await Category.findByIdAndDelete(req.params.id);

    const user = await User.findById(userRequest.id);
    user.categories = user.categories.filter((cate) =>
        cate.toString() !== req.params.id.toString()
    );

    await user.save();

    res.status(204).end();
});

categoriesRouter.put("/:id", async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "token invalid" });
    }

    const category = await Category.findById(req.params.id);
    if (!(category.user.toString() === user.id.toString())) {
        return res.status(403).json({
            error: "Only creator can edit category",
        });
    }

    const editedCategory = {
        name: req.body.name,
    };

    await Category.findByIdAndUpdate(req.params.id, editedCategory, {
        new: true,
    });
    res.status(204).end();
});

module.exports = categoriesRouter;
