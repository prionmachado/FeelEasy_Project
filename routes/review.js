const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams is used to access the id from app.js in review model
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

// review post route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// review delete route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;