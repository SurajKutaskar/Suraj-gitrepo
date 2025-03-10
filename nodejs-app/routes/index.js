const express = require("express");
const passport = require("passport");
const User = require("../modules/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Home page (login page)
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/home");
    }
    res.render("login", { messages: req.flash('error') });
});

// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash("error_msg") });
});

// Login POST route
router.post("/home", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true // This will enable flash message on failure
}));

// Home page after login
router.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("home", { username: req.user.username });
});


// Payment route
router.get("/payment", (req, res) => {
    res.render("payment");
});

router.post("/payment", async (req, res) => {
    const { token } = req.body;
    try {
        const charge = await stripe.charges.create({
            amount: 500, // Amount in cents
            currency: "usd",
            description: "Test Payment",
            source: token,
        });
        res.send("Payment Successful!");
    } catch (error) {
        res.send("Payment Failed: " + error.message);
    }
});

// Register route (for simplicity, let's use a static registration)
// Register route
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.status(400).send("Username already taken.");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

    // Create a new user instance
    const newUser = new User({
        username: username,
        password: hashedPassword,  // Save the hashed password
    });

    try {
        // Save the new user to the database
        const savedUser = await newUser.save();
        console.log("New user saved:", savedUser);
        res.redirect("/");  // Redirect to the login page after successful registration
    } catch (err) {
        res.status(500).send("Error registering user: " + err.message);
    }
});


// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    }
        ,res.redirect("/home"));
        res.render("home", { username: req.user.username });
});




module.exports = router;
