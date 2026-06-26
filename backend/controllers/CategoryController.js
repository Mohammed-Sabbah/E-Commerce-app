const Category = require("../models/Category");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const { getAll, getOne, createOne, updateOne, deleteOne } = require("./Controller");
const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");

const uploadImage = uploadSingleImage("photo", "categories");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.path;
    next();
});

const getCategories    = getAll(Category);
const createCategory   = createOne(Category);
const getCategory      = getOne(Category, "category");
const updateCategory   = updateOne(Category, "category");
const deleteCategory   = deleteOne(Category, "category");

module.exports = {
    getCategories, createCategory, getCategory,
    updateCategory, deleteCategory,
    uploadImage, resizeImage,
};
