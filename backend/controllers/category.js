const Category = require("../models/category");

const categoriesRouter = require("express").Router();

categoriesRouter.get("/", async (req, res) => {
    const categories = Category.find({}).populate("project", {
        id: 1,
        name: 1,
    }).populate(
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
        res.status(400).end();
        return;
    }

    const userRequest = req.user;
    if (!userRequest) {
        return res.status(401).json({ error: "token invalid" });
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
    const populatedCategory = await Category.findById(savedBlog.id).populate(
        "user",
        {
            id: 1,
            name: 1,
            username: 1,
        },
    ).populate("porject", {
        id: 1,
        name: 1,
    });

    res.status(201).json(populatedCategory);
});

categoriesRouter.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id).populate(
        "project",
        {
            id: 1,
            name: 1,
        },
    );
    res.json(category);
});

categoriesRouter.delete("/:id", async (req, res) => {
});

categoriesRouter.put("/:id", async (req, res) => {
});

module.exports = categoriesRouter;
