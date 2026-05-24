const validator = require('express-validator');
const User = require('../../models/User');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const CustomError = require('../CustomError');

let createUserValidator = [
    validator.check("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),

    validator.check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new CustomError("Email already exists", 400);
            }
            return true;
        }),

    validator.check("phone")
        .optional()
        .isMobilePhone("ar-PS").withMessage("Invalid phone number"),

    validator.check("profileImage")
        .optional(),

    validator.check("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    validator.check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required")
        .isLength({ min: 6 }).withMessage("confirmPassword must be at least 6 characters long")
        .custom(function (val, { req }) {
            if (val !== req.body.password) {
                throw new CustomError("confirm password does not match password", 400);
            }
            return true;
        }),

    validator.check("role")
        .optional()
        .isIn(['admin', 'user']).withMessage("Role must be either admin or user"),

    validationMiddleware
]

let getUserValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid user id"),

    validationMiddleware
]

let updateUserValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid user id"),
    validator.check("name")
        .optional()
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    validator.check("email")
        .optional()
        .isEmail().withMessage("Invalid email format")
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new CustomError("Email already exists", 400);
            }
            return true;
        }),
    validator.check("phone")
        .optional()
        .isMobilePhone("ar-PS").withMessage("Invalid phone number"),

    validator.check("password")
        .optional()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    validator.check("confirmPassword")
        .optional()
        .notEmpty().withMessage("confirmPassword is required")
        .isLength({ min: 6 }).withMessage("confirmPassword must be at least 6 characters long")
        .custom(function (val, { req }) {
            if (val !== req.body.password) {
                throw new CustomError("confirm password does not match password", 400);
            }
            return true;
        }),


    validator.check("role")
        .optional()
        .isIn(['admin', 'user']).withMessage("Role must be either admin or user"),

    validationMiddleware
]

let deleteUserValidator = [
    validator.check("id")
        .isMongoId().withMessage("Invalid user id"),

    validationMiddleware
]

let changePasswordValidator = [
    validator.check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    validator.check("newPassword")
        .notEmpty().withMessage("new password is required")
        .isLength({ min: 6 }).withMessage("new password must be at least 6 characters long")
        .custom(function (value, { req }) {
            if (value !== req.body.confirmNewPassword)
                throw new CustomError("new Password does not match confirm new password", 400);
            return true;
        }),

    validator.check("confirmNewPassword")
        .notEmpty().withMessage("confirm new password is required")
        .isLength({ min: 6 }).withMessage(" confirm new password must be at least 6 characters long"),

    validationMiddleware
]

module.exports = {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator
}