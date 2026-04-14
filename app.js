if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
};

const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public'))); 

// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
}); 

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};


app.use(session(sessionOptions));
app.use((flash()));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to set flash messages in res.locals for access in all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Make success flash messages available in all views
    res.locals.error = req.flash('error'); // Make error flash messages available in all views
    res.locals.currentUser = req.user; // Make the current user available in all views
    next();
});

// Use listing routes
app.use("/listings", listingRouter);
// Use review routes
app.use("/listings/:id/reviews", reviewRouter);  // id is only accessible in app.js so in review model the method is not working that's why we are using mergeParams in review.js to access the id from app.js
// Use user routes
app.use("/", userRouter);

// Redirect root to /listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render('error.ejs', { err });
});

// listening on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 