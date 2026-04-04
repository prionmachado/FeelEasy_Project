const User = require('../models/user.js');

// Controller functions for user-related routes
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

// Controller function for handling user registration
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');
            return res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('/signup');
    }
};

// Controller function for rendering the login form
module.exports.renderLoginForm =  (req, res) => {
    res.render('users/login.ejs');
};

// Controller function for handling user login
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    return res.redirect(res.locals.redirectUrl || '/listings');
};

// Controller function for handling user logout
module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/listings');
    });
};