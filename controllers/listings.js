const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');
const cloudinary = require('../cloudConfig.js');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Controller function for listing index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};

// Controller function for rendering new listing form
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

// Controller function for showing a specific listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'Listing Not Found');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
};

// Controller function for creating a new listing
module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError('Invalid Listing Data', 400);
    }

    // let response = await geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    // })
    //     .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Upload image to Cloudinary
    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'Wanderlust_DEV' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        newListing.image = {
            url: result.secure_url,
            filename: result.public_id
        };
    }
    // newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash('success', 'New Listing Created Successfully!');
    res.redirect('/listings');
};

// Controller function for rendering edit form for a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing Not Found');
        return res.redirect('/listings');
    }
    const originalImageUrl = listing.image.url.replace('/upload/', '/upload/w_300,c_fill/');
    res.render('listings/edit.ejs', { listing, originalImageUrl });
};

// Controller function for updating a listing
module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });

    if (!listing) {
        return next(new ExpressError('Listing Not Found', 404));
    }

    if (req.file) {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'Wanderlust_DEV' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        listing.image = {
            url: result.secure_url,
            filename: result.public_id
        };

        await listing.save();
    }

    req.flash('success', 'Listing Updated Successfully!');
    return res.redirect(`/listings/${id}`);
};

// Controller function for deleting a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect('/listings');
};