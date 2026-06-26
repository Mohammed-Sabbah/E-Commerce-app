const SubCategory = require("../models/SubCategory");
const { getAll, getOne, createOne, updateOne, deleteOne } = require("./Controller");
const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const uploadImage = uploadSingleImage("photo", "subcategories");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.path;
    next();
});

const getSubCategories    = getAll(SubCategory);
const createSubCategory   = createOne(SubCategory);
const getSubCategory      = getOne(SubCategory, "SubCategory");
const updateSubCategory   = updateOne(SubCategory, "SubCategory");
const deleteSubCategory   = deleteOne(SubCategory, "SubCategory");

module.exports = {
    getSubCategories, createSubCategory, getSubCategory,
    updateSubCategory, deleteSubCategory,
    uploadImage, resizeImage,
};
