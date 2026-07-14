const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Category = require("../../models/Category");

let getSubCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid SubCategory ID format"),

    validationMiddleware
]

let createSubCategoryValidator = [
    validator.check("name.en")
        .notEmpty().withMessage("subCategory English name is required")
        .isLength({ min: 2 }).withMessage("subCategory English name must be larger than 2")
        .isLength({ max: 32 }).withMessage("subCategory English name must be less than 32"),
    validator.check("name.ar")
        .notEmpty().withMessage("subCategory Arabic name is required")
        .isLength({ min: 2 }).withMessage("subCategory Arabic name must be larger than 2")
        .isLength({ max: 32 }).withMessage("subCategory Arabic name must be less than 32"),

    validator.check("category")
        .notEmpty().withMessage("SubCategory must belong to parent category")
        .isMongoId().withMessage("Invalid SubCategory ID format")
        .custom(async (categoryID) => {
            let category = await Category.findById(categoryID);
            if (!category)
                throw new Error("The provided category is not exist in the db.");
            return true;
        }),

    validator.check("categoryId")
        .optional()
        .notEmpty().withMessage("SubCategory must belong to parent category")
        .isMongoId().withMessage("Invalid SubCategory ID format")
        .custom(async (categoryID) => {
            let category = await Category.findById(categoryID);
            if (!category)
                throw new Error("The provided category is not exist in the db.");
            return true;
        }),

    validationMiddleware
]

let updateSubCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid SubCategory ID format"),

    validator.check("name.en").optional()
        .notEmpty().withMessage("subCategory English name is required")
        .isLength({ min: 2 }).withMessage("subCategory English name must be larger than 2")
        .isLength({ max: 32 }).withMessage("subCategory English name must be less than 32"),
    validator.check("name.ar").optional()
        .notEmpty().withMessage("subCategory Arabic name is required")
        .isLength({ min: 2 }).withMessage("subCategory Arabic name must be larger than 2")
        .isLength({ max: 32 }).withMessage("subCategory Arabic name must be less than 32"),

    validator.check("category").optional()
        .notEmpty().withMessage("SubCategory must belong to parent category")
        .isMongoId().withMessage("Invalid SubCategory ID format")
        .custom(async (categoryID) => {
            let category = await Category.findById(categoryID);
            if (!category)
                throw new Error("The provided category is not exist in the db.");
            return true;
        }),

    validationMiddleware
]

let deleteSubCategoryValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid SubCategory ID format"),

    validationMiddleware
]

module.exports = {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
}