const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true,
    },
    pashwordHash: {
        type: String,
    },
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // The passwordHash should not be revealed
        delete returnedObject.pashwordHash;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
