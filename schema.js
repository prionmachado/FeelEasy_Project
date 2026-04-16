const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow('', null),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().valid(
            "rooms",
            "iconic-cities",
            "mountains",
            "castles",
            "pools",
            "camping",
            "farms",
            "arctic",
            "domes",
            "boats"
        ).required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});

module.exports.userSchema = joi.object({
    username: joi.string().min(3).required().messages({
        'string.min': 'Username must be at least 3 characters',
        'any.required': 'Username is required'
    }),
    email: joi.string().email().required().custom((value, helpers) => {
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

        const domain = value.toLowerCase().split('@')[1];

        if (!allowedDomains.includes(domain)) {
            return helpers.error('string.invalidDomain');
        }

        return value;
    }).messages({
        'string.email': 'Please enter a valid email address',
        'string.invalidDomain': 'Please use a valid email provider (gmail, yahoo, outlook, etc.)',
        'any.required': 'Email is required'
    }),
    password: joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
            'any.required': 'Password is required'
        })
});