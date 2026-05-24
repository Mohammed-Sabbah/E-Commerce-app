const crypto = require("crypto");
const sharp = require("sharp");
const Brand = require("../models/Brand");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");
const {
    uploadSingleImage
} = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

let uploadImage = uploadSingleImage("photo");

let resizeImage = asyncErrorHandler(async function (req, res, next) {
    let unique = crypto.randomBytes(9).toString("hex");
    let fileName = `brand-${unique}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/brands/${fileName}`);

        req.body.photo = fileName;
    }
    next();
});


let getAllBrands = getAll(Brand);

let createBrand = createOne(Brand);

let getBrand = getOne(Brand, "brand");

let updateBrand = updateOne(Brand, "brand")

let deleteBrand = deleteOne(Brand, "brand");

module.exports = {
    getAllBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadImage,
    resizeImage
};