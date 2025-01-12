// Import necessary modules
const bcrypt = require("bcrypt"); // For hashing passwords
const usersRouter = require("express").Router(); // Create a new router instance
const User = require("../models/user"); // User model

// Handle user creation
usersRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body; // Extract user data from request body

    // Validate password presence and length
    if (!req.body.password) {
        return res.status(400).json({ error: "password missing" });
    }

    if (req.body.password.length < 3) {
        return res.status(400).json({
            error: "password must be at least 3 characters long",
        });
    }

    // Hash the password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const user = new User({
        name,
        username,
        passwordHash,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Respond with the created user
    res.status(201).json(savedUser);
});

// Handle fetching all users
usersRouter.get("/", async (req, res) => {
    const users = await User.find({}); // Fetch all users from the database

    res.json(users); // Respond with the list of users
});

// Export the router
module.exports = usersRouter;
