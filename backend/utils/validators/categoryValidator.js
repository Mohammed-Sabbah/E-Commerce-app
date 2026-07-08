const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

let getCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid category id format."),
    validationMiddleware
];

let createCategoryValidator = [
    validator.check("name.en")
        .notEmpty().withMessage("category English name is required.")
        .isLength({ min: 2 }).withMessage("category English name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("category English name must be less than 32 characters."),
    validator.check("name.ar")
        .notEmpty().withMessage("category Arabic name is required.")
        .isLength({ min: 2 }).withMessage("category Arabic name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("category Arabic name must be less than 32 characters."),
    validationMiddleware
];

let updateCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid category id format."),
    validator.check("name.en").optional()
        .notEmpty().withMessage("category English name is required.")
        .isLength({ min: 2 }).withMessage("category English name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("category English name must be less than 32 characters."),
    validator.check("name.ar").optional()
        .notEmpty().withMessage("category Arabic name is required.")
        .isLength({ min: 2 }).withMessage("category Arabic name must be larger than 2 characters.")
        .isLength({ max: 32 }).withMessage("category Arabic name must be less than 32 characters."),
    validationMiddleware
];

let deleteCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid category id format"),
    validationMiddleware
];

module.exports = {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
}