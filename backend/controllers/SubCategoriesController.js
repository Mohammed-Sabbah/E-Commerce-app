const crypto = require("crypto");
const sharp = require("sharp");
const SubCategory = require("../models/SubCategory");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

let uploadImage = uploadSingleImage("photo");

let resizeImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let uniqe = crypto.randomBytes(9).toString("hex");
        let fileName = `subCategory-${uniqe}-${Date.now()}.jpeg`;

        sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile("uploads/subCategories");

        req.body.photo = fileName;
    }
    next()
})

let getSubCategories = getAll(SubCategory);

let createSubCategory = createOne(SubCategory);

let getSubCategory = getOne(SubCategory, "SubCategory");

let updateSubCategory = updateOne(SubCategory, "SubCategory");

let deleteSubCategory = deleteOne(SubCategory, "SubCategory");

module.exports = {
    getSubCategories,
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    uploadImage,
    resizeImage
}