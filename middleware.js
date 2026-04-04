const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema.js');

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL they were trying to access
        req.flash('error', 'You must be logged in to create a listing!');
        return res.redirect('/login');
    }
    next();
};

// Middleware to make the redirect URL available in res.locals for access in routes
module.exports.saveRedirectUrl = async (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available in res.locals for access in routes
    }
    next();
};

// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}; 

// Validation listing middleware(schema.js)
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    }
    else {
        next();
    }
};

// Validation review middleware(schema.js)
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    }
    else {
        next();
    }
}; 

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}; 