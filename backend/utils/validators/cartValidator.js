const validator = require("express-validator");
const Product = require("../../models/Product");
const Coupon = require("../../models/Coupon");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const CustomError = require("../CustomError");

const addToCartValidator = [
    validator.check("product")
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("invalid product id format")
        .custom(async (value) => {
            const product = await Product.findById(value);
            if (!product)
                throw new CustomError("No product found", 404);
            return true;
        }),

    validator.check("color")
        .notEmpty()
        .withMessage("color is required")
        .isString()
        .withMessage("color must be string")
        .custom(async (value, { req }) => {
            if (req.body.product) {
                const product = await Product.findById(req.body.product);
                if (!product)
                    throw new CustomError("No product found", 404);
                if (!product.colors.includes(value))
                    throw new CustomError("this color not available product color", 400);
            }
            else
                throw new CustomError("Product id is required", 400);

            return true;
        }),

    validationMiddleware
]

const removeFromCartValidator = [
    validator.check("id")
        .notEmpty().withMessage("item id is required")
        .isMongoId().withMessage("invalid item id format"),

    validationMiddleware
]

const updateItemQuantityValidator = [
    validator.check("id")
        .notEmpty().withMessage("item id is required")
        .isMongoId().withMessage("invalid item id format"),

    validator.check("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isNumeric()
        .withMessage("quantity must be string"),

    validationMiddleware
]

const applyCouponOnCartValidator = [
    validator.check("coupon")
        .notEmpty()
        .withMessage("coupon is required")
        .isString()
        .withMessage("coupon must be string")
        .custom(async (value) => {
            const coupon = await Coupon.findOne({
                name: value,
                expire: { $gte: Date.now() }
            });
            if (!coupon)
                throw new CustomError("Invalid or expired coupon", 404);
            return true;
        }),

    validationMiddleware
]

module.exports = {
    addToCartValidator,
    removeFromCartValidator,
    updateItemQuantityValidator,
    applyCouponOnCartValidator
}