const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

let getBrandValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Brand id format."),
    validationMiddleware
];

let createBrandValidator = [
    validator.check("name.en")
        .notEmpty().withMessage("Brand English name is required.")
        .isLength({ min: 2 }).withMessage("Brand English name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("Brand English name must be less than 32 characters."),
    validator.check("name.ar")
        .notEmpty().withMessage("Brand Arabic name is required.")
        .isLength({ min: 2 }).withMessage("Brand Arabic name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("Brand Arabic name must be less than 32 characters."),
    validationMiddleware
];

let updateBrandValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Brand id format."),
    validator.check("name.en").optional()
        .notEmpty().withMessage("Brand English name is required.")
        .isLength({ min: 2 }).withMessage("Brand English name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("Brand English name must be less than 32 characters."),
    validator.check("name.ar").optional()
        .notEmpty().withMessage("Brand Arabic name is required.")
        .isLength({ min: 2 }).withMessage("Brand Arabic name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("Brand Arabic name must be less than 32 characters."),
    validationMiddleware
];

let deleteBrandValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Brand id format"),
    validationMiddleware
];

module.exports = {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
}