// Import necessary modules
const bcrypt = require("bcrypt"); // For hashing passwords
const usersRouter = require("express").Router(); // Create a new router instance
const User = require("../models/user"); // User model

// Handle user creation
usersRouter.post("/", async (req, res) => {
    const { username, email, password } = req.body; // Extract user data from request body

    // Validate password presence and length
    if (!req.body.password) {
        return res.status(400).json({ error: "password missing" });
    }

    if (req.body.password.length < 3) {
        return res.status(400).json({
            error: "password must be at least 3 characters long",
        });
    }

    // validate email presence and format
    if (!req.body.email) {
        return res.status(400).json({ error: "email missing" });
    }
    if (!req.body.email.includes("@")) {
        return res.status(400).json({ error: "email not valid" });
    }

    // Validate username presence and length
    if (!req.body.username) {
        return res.status(400).json({ error: "username missing" });
    }

    if (req.body.username.length < 3) {
        return res.status(400).json({
            error: "username must be at least 3 characters long",
        });
    }


    const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // Check if a user with the same username or email already exists
    if (existingUser) {
        const message = existingUser.username === username ? "username already exists" : "email already exists";
        // If a user with the same username or email exists, respond with an error
        return res.status(409).json({ error: message });
    }
    // Hash the password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const user = new User({
        username,
        passwordHash,
        avatarUrl: null,
        email:null,
        gender: null,
        dateOfBirth: null,
        phoneNumber: null,
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
