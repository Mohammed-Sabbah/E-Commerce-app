
const validator = require('express-validator');
const User = require('../../models/User');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const CustomError = require('../CustomError');

let signupValidator = [
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
        .isIn(['user']).withMessage("Role can only be user"),

    validationMiddleware
]

let loginValidator = [
    validator.check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    validator.check("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    validationMiddleware
]

let forgetPasswordValidator = [
    validator.check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async function (email) {
            let user = await User.findOne({ email });
            if (!user)
                throw new CustomError("There is no user with the provided email", 404);
            return true;
        }),

    validationMiddleware
]

let verifyResetCodeValidator = [
    validator.check("resetCode")
        .notEmpty().withMessage("resetCode is required")
        .custom(function (value) {
            if (!((value >= 100000) && (value <= 999999)))
                throw new CustomError("Invalid reset code format", 400);
            return true;
        }),

    validationMiddleware
]

let resetPasswordValidator = [
    validator.check("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new CustomError("There is no user with this email", 404);
            }
            return true;
        }),

    validator.check("newPassword")
        .notEmpty().withMessage("newPassword is required")
        .isLength({ min: 6 }).withMessage("newPassword must be at least 6 characters long")
        .custom(function (val, { req }) {
            if (val !== req.body.confirmNewPassword) {
                throw new CustomError("confirm new password does not match new password", 400);
            }
            return true;
        }),
    validationMiddleware
]


module.exports = {
    signupValidator,
    loginValidator,
    forgetPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator
}