const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { default: slugify } = require("slugify");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const { createToken } = require("../utils/JWTs");
const { sendResetPasswordEmail } = require("../utils/emails");
const { parseDuration } = require("../utils/parseDuration");

let sendRes = function (res, statusCode, user) {
    let token = createToken(user.id);
    let maxAge;

    try {
        maxAge = parseDuration(process.env.JWT_EXPIRES_IN);
    } catch (error) {
        console.error('Error parsing JWT_EXPIRES_IN:', error.message);
        maxAge = 7 * 24 * 60 * 60 * 1000; // fallback 7 days
    }

    let options = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge
    };


    if (process.env.NODE_ENV === "production")
        options.secure = true;

    res.cookie("token", token, options);

    res.status(statusCode).json({
        status: "success",
        user,
        token
    });
}

let signup = asyncErrorHandler(async function (req, res) {
    if (req.body.role === "admin")
        throw new CustomError("You can not signup as an admin!", 403);
    if (req.body.name)
        req.body.slug = slugify(req.body.name);

    let user = await User.create(req.body);

    user.password = undefined; // remove password from response

    sendRes(res, 201, user);
});

let login = asyncErrorHandler(async function (req, res) {
    let { email, password } = req.body;

    // Ensure password is selected
    let user = await User.findOne({ email }).select('+password');

    if (!user || !bcryptjs.compareSync(password, user.password))
        throw new CustomError("Email or password is wrong", 400);

    if (!user.isActive)
        throw new CustomError("Your account has been deactivated", 403);

    sendRes(res, 200, user);
});

let forgetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });

    // create random 6 chars
    let passwordResetCode = crypto.randomInt(100000, 999999);
    user.passwordResetCode = crypto.createHash("sha256").update(`${passwordResetCode}`).digest("hex");
    user.passwordResetCodeExpires = Date.now() + 15 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    let emailBody = `We receive your request to reset your password, use this code to reset your password\n\n${passwordResetCode}\n\nThe reset code is valid for 15 minutes`;

    let emailOptions = {
        from: "eShop Support",
        to: user.email,
        subject: "rest password code",
        emailBody
    }

    try {
        await sendResetPasswordEmail(emailOptions);
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        throw new CustomError("Error in sending reset password email, please try again later!", 500);
    }

    res.status(200).json({
        status: "success",
        message: "Reset password code sent to your email"
    });

});

const verifyResetCode = asyncErrorHandler(async function (req, res) {
    let hashedResetCode = crypto.createHash("sha256").update(`${req.body.resetCode}`).digest("hex");
    let user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetCodeExpires: { $gte: Date.now() }
    });

    if (!user)
        throw new CustomError("Wrong or expired reset code", 400);

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: "success"
    });
});

let resetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });

    if (!user.passwordResetVerified)
        throw new CustomError("You have not verify your password yet", 403);

    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    sendRes(res, 200, user);
});

module.exports = {
    signup,
    login,
    forgetPassword,
    verifyResetCode,
    resetPassword
}