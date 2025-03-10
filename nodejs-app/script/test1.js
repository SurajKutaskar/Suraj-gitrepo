const bcrypt = require('bcryptjs');

const plainPassword = 'saket321';  // The password to hash

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) throw err;
    console.log('Hashed password:', hashedPassword);  // This is what you'll store in the database
});
