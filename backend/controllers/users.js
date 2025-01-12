const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!req.body.password) {
        return res.status(400).json({ error: "password missing" });
    }

    if (req.body.password.length < 3) {
        return res.status(400).json({
            error: "password must be at least 3 characters long",
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});

usersRouter.get("/", async (req, res) => {
    const users = await User.find({});

    res.json(users);
});

module.exports = usersRouter;
