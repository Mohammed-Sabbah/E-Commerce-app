const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const CustomError = require("../CustomError");

let getCouponValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid coupon id format."),

    validationMiddleware
];

let createCouponValidator = [
    validator.check("name")
        .notEmpty()
        .withMessage("coupon name is required.")
        .isString()
        .withMessage("name must be string"),

    validator.check("discount")
        .notEmpty()
        .withMessage("discount is required.")
        .isNumeric()
        .withMessage("discount must be number")
        .custom((discount) => {
            if (discount < 1 || discount > 100)
                throw new CustomError("discount must be between 1 & 100", 400)
            return true;
        }),

    validator.check("expire")
        .notEmpty()
        .withMessage("expire  is required.")
        .isDate()
        .withMessage("expire must be date."),
    
    validationMiddleware
];

let updateCouponValidator = [
    validator.check("id")
        .isMongoId().
        withMessage("Invalid coupon id format."),

    validator.check("name")
        .optional()
        .notEmpty()
        .withMessage("coupon name is required.")
        .isString()
        .withMessage("name must be string"),

    validator.check("discount")
        .optional()
        .notEmpty()
        .withMessage("discount is required.")
        .isNumeric()
        .withMessage("discount must be number")
        .custom((discount) => {
            if (discount < 1 || discount > 100)
                throw new CustomError("discount must be between 1 & 100", 400)
            return true;
        }),

    validator.check("expire")
        .optional()
        .notEmpty()
        .withMessage("expire  is required.")
        .isDate()
        .withMessage("expire must be date."),


    validationMiddleware
];

let deleteCouponValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid coupon id format"),
    validationMiddleware
];

module.exports = {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
}