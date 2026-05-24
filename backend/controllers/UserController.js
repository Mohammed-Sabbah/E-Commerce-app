const sharp = require("sharp");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
} = require("./Controller");

const { createToken } = require("../utils/JWTs")

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const CustomError = require("../utils/CustomError");


let getAllUsers = getAll(User);

let createUser = createOne(User);

let getUser = getOne(User, "User");

let updateUser = updateOne(User, "User");

let deleteUser = deleteOne(User, "User");

let uploadUserImage = uploadSingleImage("profileImage");

let resizeUserImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let unique = crypto.randomUUID()
        let fileName = `user-${unique}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`);

        req.body.profileImage = fileName;
    }

    next();
});

let changePassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id).select("+password");

    if (!bcryptjs.compareSync(req.body.password, user.password))
        throw new CustomError("The provided password does not match the the password in the db.", 400);

    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    let token = createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    })
});

let deleteMe = asyncErrorHandler(async function (req, res) {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).send();
});

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeUserImage,
    changePassword,
    deleteMe
};
