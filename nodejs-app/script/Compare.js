const bcrypt = require('bcryptjs');

// Example test data
const plainPassword = 'shubham321';  // The password to test
const storedHashedPassword = '$2b$10$QG8At0awmfyhcmMAU6lfJOtYJuwxlk4LdBw7bvMZXeEUiZOK2bhw.'; // The hashed password from the database

bcrypt.compare(plainPassword, storedHashedPassword, (err, isMatch) => {
    if (err) throw err;
    console.log("Entered password:", plainPassword);  // Log the entered plain password
    console.log("Stored hashed password:", storedHashedPassword);  // Log the stored hashed password
    console.log('Password match result:', isMatch);  // Should be true if they match
});
