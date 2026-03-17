const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

let getBrandValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Brand id format."),
    validationMiddleware
];

let createBrandValidator = [
    validator.check("name")
        .notEmpty().withMessage("Brand name is required.")
        .isLength({ min: 3 }).withMessage("Brand name length must be larger than 3 characters.")
        .isLength({ max: 32 }).withMessage("Brand name length must be less than 32 characters."),
    validationMiddleware
];

let updateBrandValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Brand id format."),
    validator.check("name").optional()
        .notEmpty().withMessage("Brand name is required.")
        .isLength({ min: 3 }).withMessage("Brand name length must be larger than 3 characters.")
        .isLength({ max: 32 }).withMessage("Brand name length must be less than 32 characters."),
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