const Brand = require("../models/Brand");
const { getAll, getOne, createOne, updateOne, deleteOne } = require("./Controller");
const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const uploadImage = uploadSingleImage("photo", "brands");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.path;
    next();
});

const getAllBrands  = getAll(Brand);
const createBrand  = createOne(Brand);
const getBrand     = getOne(Brand, "brand");
const updateBrand  = updateOne(Brand, "brand");
const deleteBrand  = deleteOne(Brand, "brand");

module.exports = {
    getAllBrands, getBrand, createBrand,
    updateBrand, deleteBrand,
    uploadImage, resizeImage,
};
