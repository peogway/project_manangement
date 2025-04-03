// Import necessary modules
const jwt = require("jsonwebtoken"); // For generating JSON Web Tokens
const bcrypt = require("bcrypt"); // For hashing and comparing passwords
const loginRouter = require("express").Router(); // Create a new router instance
const User = require("../models/user"); // User model

// Handle login requests
loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Find user by username in the database
    const user = await User.findOne({ username });

    // Check if password is correct
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    // Respond with 401 if authentication fails
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: "invalid username or password",
        });
    }

    // Prepare user data for token
    const userForToken = {
        username: user.username,
        id: user._id,
    };

    // Generate a JSON Web Token with an expiration of 1 hour
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 },
    );

    // Respond with the token and user information
    res.status(200).send({
        token,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
    });
});

// Export the router
module.exports = loginRouter;
