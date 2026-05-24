const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

let getAddressValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Address id format."),

    validationMiddleware
];

let createAddressValidator = [
    validator.check("alias")
        .notEmpty()
        .withMessage("Address alias is required."),

    validator.check("details")
        .notEmpty()
        .withMessage("Address details is required."),

    validator.check("phone")
        .notEmpty()
        .withMessage("phone is required.")
        .isMobilePhone(["ar-PS", "he-IL"])
        .withMessage("invalid phone number"),

    validator.check("city")
        .notEmpty()
        .withMessage("city is required."),

    validator.check("postalCode")
        .notEmpty()
        .withMessage("postalCode  is required."),
    // .isPostalCode("PL")
    // .withMessage("invalid postal code"),

    validationMiddleware
];

let updateAddressValidator = [
    validator.check("id")
        .isMongoId().
        withMessage("Invalid Address id format."),

    validator.check("alias")
        .optional()
        .notEmpty()
        .withMessage("Address alias is required."),

    validator.check("details")
        .optional()
        .notEmpty()
        .withMessage("Address details is required."),

    validator.check("phone")
        .optional()
        .notEmpty()
        .withMessage("phone is required.")
        .isMobilePhone(["ar-PS", "he-IL"])
        .withMessage("invalid phone number"),

    validator.check("city")
        .optional()
        .notEmpty()
        .withMessage("city is required."),

    validator.check("postalCode")
        .optional()
        .notEmpty()
        .withMessage("postalCode is required."),
    // .isPostalCode("PL")
    // .withMessage("invalid postal code"),

    validationMiddleware
];

let deleteAddressValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid Address id format"),
    validationMiddleware
];

module.exports = {
    getAddressValidator,
    createAddressValidator,
    updateAddressValidator,
    deleteAddressValidator
}