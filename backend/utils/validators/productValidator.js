const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
let Category = require("../../models/Category");
let SubCategory = require("../../models/SubCategory");
let Brand = require("../../models/Brand");

let getProductValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid product id format."),

    validationMiddleware
];

let createProductValidator = [
    validator.check("name")
        .trim()
        .notEmpty().withMessage("product name is required.")
        .isString().withMessage("product name must contain alphabets & number only.")
        .isLength({ min: 3 }).withMessage("product name length must be larger than 3 characters."),

    validator.check("description")
        .notEmpty().withMessage("product description is required.")
        .isLength({ min: 20 }).withMessage("product description length must be larger than 20 characters."),

    validator.check("quantity")
        .notEmpty().withMessage("product quantity is required.")
        .isNumeric().withMessage("product quantity must be number."),

    validator.check("sold")
        .optional()
        .isNumeric().withMessage("product Sold must be number."),

    validator.check("price")
        .notEmpty().withMessage("product price is required.")
        .isNumeric().withMessage("product price must be number."),

    validator.check("priceAfterDiscount")
        .optional()
        .isNumeric().withMessage("product priceAfterDiscount must be number.")
        .custom((value, { req }) => {
            if (value > req.body.price)
                throw new Error("priceAfterDiscount must be less than price");
            return true;
        })
        .toFloat(),

    validator.check("colors")
        .optional()
        .isArray(),

    validator.check("coverImage")
        .notEmpty().withMessage("product cover image is required."),

    validator.check("images")
        .optional()
        .isArray(),

    validator.check("category")
        .notEmpty().withMessage("product must belong to category.")
        .isMongoId().withMessage("Invalid category id format.")
        .custom(async (categoryId) => {
            let category = await Category.findById(categoryId);
            if (!category) {
                throw new Error("The provided category is not exist in the db.");
            }
            return true;
        }),

    validator.check("subCategory")
        .optional()
        .isArray()
        .custom(async (subCategoryIds) => {
            let result = subCategoryIds.every(id => validator.check(id).isMongoId());
            if (!result)
                throw new Error(`One or more invalid subCategory id format.`);
            return true;
        })
        .custom(async (subCategoryIds, { req }) => {
            let promises = subCategoryIds.map(id => SubCategory.findById(id));
            let subCategories = await Promise.all(promises);
            if (subCategories.includes(null))
                throw new Error(`One or more provided subCategory is not exist in the db.`);

            let categories = subCategories.map(subCategory => subCategory.category);
            if (!categories.every(category => category == req.body.category))
                throw new Error("One or more provided subCategory does not belong to the provided category.");
            return true;
        }),

    validator.check("brand")
        .optional()
        .isMongoId().withMessage("Invalid brand id format.")
        .custom(async (brandId) => {
            let brand = await Brand.findById(brandId);
            if (!brand) {
                throw new Error("The provided brand is not exist in the db.");
            }
            return true;
        }),

    validator.check("avgRatings")
        .optional()
        .isNumeric().withMessage("product avgRatings must be number.")
        .isLength({ min: 1, max: 5 }).withMessage("product avgRatings must be between 1 & 5."),

    validator.check("ratingsQuantity")
        .optional()
        .isNumeric().withMessage("product ratingsQuantity must be number."),

    validationMiddleware
];

let updateProductValidator = [
    validator.check("name")
        .optional()
        .trim()
        .isString().withMessage("product name must contain alphabets & number only.")
        .isLength({ min: 3 }).withMessage("product name length must be larger than 3 characters."),

    validator.check("description")
        .optional()
        .isLength({ min: 20 }).withMessage("product description length must be larger than 20 characters."),

    validator.check("quantity")
        .optional()
        .isNumeric().withMessage("product quantity must be number."),

    validator.check("sold")
        .optional()
        .isNumeric().withMessage("product Sold must be number."),

    validator.check("price")
        .optional()
        .isNumeric().withMessage("product price must be number."),

    validator.check("priceAfterDiscount")
        .optional()
        .isNumeric().withMessage("product priceAfterDiscount must be number.")
        .custom((value, { req }) => {
            if (req.body.price)
                if (value > req.body.price)
                    throw new Error("priceAfterDiscount must be less than price");
            return true;
        })
        .toFloat(),

    validator.check("colors")
        .optional()
        .isArray(),

    validator.check("coverImage")
        .optional(),

    validator.check("images")
        .optional()
        .isArray(),

    validator.check("category")
        .optional()
        .isMongoId().withMessage("Invalid category id format.")
        .custom(async (categoryId) => {
            let category = await Category.findById(categoryId);
            if (!category)
                throw new Error("The provided Category is not exist in the db.");
            return true;
        }),

    validator.check("subCategory")
        .optional()
        .isArray()
        .custom(async (subCategoryIds) => {
            let result = subCategoryIds.every(id => validator.check(id).isMongoId());
            if (result)
                throw new Error(`One or more invalid subCategory id format.`);
            return true;
        })
        .custom(async (subCategoryIds, { req }) => {
            let promises = subCategoryIds.map(id => SubCategory.findById(id));
            let subCategories = await Promise.all(promises);
            if (subCategories.includes(null))
                throw new Error(`One or more provided subCategory is not exist in the db.`);

            let categories = subCategories.map(subCategory => subCategory.category);
            if (!categories.every(category => category == req.body.category))
                throw new Error("One or more provided subCategory does not belong to the provided category.");
            return true;
        }),

    validator.check("brand")
        .optional()
        .isMongoId().withMessage("Invalid brand id format.")
        .custom(async (brandId) => {
            let brand = await Brand.findById(brandId);
            if (!brand) {
                throw new Error("The provided brand is not exist in the db.");
            }
            return true;
        }),

    validator.check("avgRatings")
        .optional()
        .isNumeric().withMessage("product avgRatings must be number.")
        .isLength({ min: 1, max: 5 }).withMessage("product avgRatings must be between 1 & 5."),

    validator.check("ratingsQuantity")
        .optional()
        .isNumeric().withMessage("product ratingsQuantity must be number."),

    validationMiddleware
];

let deleteProductValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid product id format"),

    validationMiddleware
];

module.exports = {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
}