const validator = require('express-validator');
const Product = require("../../models/Product");
const Review = require("../../models/Review");
const validationMiddleware = require('../../middlewares/validationMiddleware');
const CustomError = require('../CustomError');

let createReviewValidator = [
    validator.check("user")
        .notEmpty().withMessage("User Id is required")
        .isMongoId().withMessage("Invalid user id format")
        .custom(async function (value, { req }) {
            let review = await Review.findOne({ user: value, product: req.body.product });
            if (review)
                throw new CustomError("You can add only one review on this product", 400);
            return true;
        }),

    validator.check("product")
        .notEmpty().withMessage("Product Id is required")
        .isMongoId().withMessage("Invalid product id format")
        .custom(async function (value) {
            let product = await Product.findById(value);
            if (!product)
                throw new CustomError("No product found with this id", 404);
            return true;
        }),

    validator.check("comment")
        .notEmpty().withMessage("comment is required"),

    validator.check("rating")
        .notEmpty().withMessage("rating is required")
        .isNumeric().withMessage("rating must be number")
        .custom(function (value) {
            if (value < 1 || value > 5)
                throw new CustomError("rating must be between 1 & 5", 400)
            return true;
        }),

    validationMiddleware
]

let getReviewValidator = [
    validator.check("id")
        .notEmpty().withMessage("Id is required")
        .isMongoId().withMessage("Invalid id format"),

    validationMiddleware
]

let updateReviewValidator = [
    validator.check("id")
        .notEmpty().withMessage("Id is required")
        .isMongoId().withMessage("Invalid id format")
        .custom(async function (reviewId, { req }) {
            let review = await Review.findById(reviewId);
            if (req.user.id !== review.user.id)
                throw new CustomError("You can not update, this review, it does not belong to you!", 403);
            return true;
        }),

    validator.check("user")
        .notEmpty().withMessage("User Id is required")
        .isMongoId().withMessage("Invalid user id format"),

    validator.check("product")
        .notEmpty().withMessage("Product Id is required")
        .isMongoId().withMessage("Invalid product id format")
        .custom(async function (value) {
            let product = await Product.findById(value);
            if (!product)
                throw new CustomError("No product found with this id", 404);
            return true;
        }),

    validator.check("comment")
        .optional()
        .notEmpty().withMessage("comment is required"),

    validator.check("rating")
        .optional()
        .notEmpty().withMessage("rating is required")
        .isNumeric().withMessage("rating must be number")
        .custom(function (value) {
            if (value < 1 || value > 5)
                throw new CustomError("rating must be between 1 & 5", 400)
            return true;
        }),

    validationMiddleware
]

let deleteReviewValidator = [
    validator.check("id")
        .notEmpty().withMessage("Id is required")
        .isMongoId().withMessage("Invalid id format")
        .custom(async function (reviewId, { req }) {
            let review = await Review.findById(reviewId);
            if (!review)
                throw new CustomError("No review found", 404);

            if (!["admin"].includes(req.user.role) && req.user.id !== review.user.id)
                throw new CustomError("You can not delete, this review, it does not belong to you!", 403);
            return true;
        }),

    validationMiddleware
]

module.exports = {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
}