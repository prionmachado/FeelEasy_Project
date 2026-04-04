const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

// Create a new review and associate it with the listing and the user
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError('Listing Not Found', 404);
    }  

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // associate the review with the user who created it
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Review Added Successfully!');
    res.redirect(`/listings/${listing._id}`);
};

// Delete a review and remove its reference from the listing
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/listings/${id}`);
};