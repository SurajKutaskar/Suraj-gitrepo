const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../modules/user'); // Adjust the path based on your project structure

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/nodejs-app', {
    // Remove these deprecated options
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

async function testPasswordComparison() {
    try {
        // Retrieve a user from the database
        const user = await User.findOne({ username: 'shubham' });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log("Stored hashed password:", user.password);

        // Test the password comparison (use the password you want to test)
        const enteredPassword = 'mypassword321';
        const isMatch = await bcrypt.compare(enteredPassword, user.password);

        console.log('Password match:', isMatch); // Should log `true` if correct, `false` if incorrect

    } catch (err) {
        console.error('Error during password comparison:', err);
    }
}

// Run the test
testPasswordComparison();

