const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./modules/user');  // Your User model file

mongoose.connect('mongodb://localhost:27017/nodejs-app', {
 
})
.then(async () => {
  console.log("MongoDB connected");

  // Create users with hashed passwords
  const users = [
    { username: 'suraj1', password: 'shubham321' },
    { username: 'shubham1', password: 'suraj321' },
    { username: 'rajesh1', password: 'rajesh321' },
    { username: 'shushant1', password: 'shush321' },
    { username: 'saket1', password: 'saket321' }
  ];

  for (let user of users) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Create a new user instance
    const newUser = new User({
      username: user.username,
      password: hashedPassword
    });

    try {
      await newUser.save();  // Save to the database
      console.log(`User ${user.username} created`);
    } catch (err) {
      console.log('Error creating user:', err.message);
    }
  }

  mongoose.connection.close();  // Close the connection after seeding
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
