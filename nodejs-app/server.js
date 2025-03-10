const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportLocal = require("passport-local").Strategy;
const User = require('./modules/user');
const dotenv = require("dotenv");
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const flash = require("connect-flash"); // Import connect-flash for flash messages

dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware setup
app.set('views', path.join(__dirname, 'views')); // Correct path to views folder
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Use connect-flash middleware
app.use(flash());  // This will allow you to use req.flash() in your routes

// Passport.js setup for local strategy
passport.use(new passportLocal(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            console.log(user); // Log the user data to see if it's found
            if (!user) {
                return done(null, false, { message: "No user found" });
            }

            // Compare passwords using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password entered:", password);
            console.log("Hashed password stored:", user.password);
            console.log(bcrypt); // Log the user data to see if it's found
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
// Sign-up route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash("error_msg", "Username already taken!");
            return res.redirect("/signup");
        }

        const newUser = new User({ username, password });
        await newUser.save();
        req.flash("success_msg", "You are now registered and can log in.");
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Error while registering user.");
        res.redirect("/signup");
    }
});

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',  // Redirect to dashboard on successful login
    failureRedirect: '/login',  // Redirect back to login page on failure
    failureFlash: true  // Flash error message
}));

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

// Routes setup
const routes = require("./routes/index");
app.use("/", routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

