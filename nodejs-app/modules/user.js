const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure the username is unique
    },
    password: {
        type: String,
        required: true,
    }
});

// Hash the password before saving the user
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // 10 salt rounds
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;

