const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

let getCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid category id format."),
    validationMiddleware
];

let createCategoryValidator = [
    validator.check("name")
        .notEmpty().withMessage("category name is required.")
        .isLength({ min: 3 }).withMessage("category name length must be larger than 3 characters.")
        .isLength({ max: 32 }).withMessage("category name length must be less than 32 characters."),
    validationMiddleware
];

let updateCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid category id format."),
    validator.check("name").optional()
        .notEmpty().withMessage("category name is required.")
        .isLength({ min: 3 }).withMessage("category name length must be larger than 3 characters.")
        .isLength({ max: 32 }).withMessage("category name length must be less than 32 characters."),
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