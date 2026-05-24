const crypto = require("crypto");
const sharp = require("sharp");
const Category = require("../models/Category");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");
const {
    uploadSingleImage
} = require("../middlewares/uploadImagesMiddleware")

let uploadImage = uploadSingleImage("photo");

let resizeImage = asyncErrorHandler(async function (req, res, next) {
    let unique = crypto.randomBytes(9).toString("hex");
    let fileName = `category-${unique}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`);

        req.body.photo = fileName;
    }
    next();
});

let getCategories = getAll(Category);

let createCategory = createOne(Category)

let getCategory = getOne(Category, "category");

let updateCategory = updateOne(Category, "category")

let deleteCategory = deleteOne(Category, "category");

module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
    resizeImage
};