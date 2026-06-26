const Product = require("../models/Product");
const { getAll, getOne, createOne, updateOne, deleteOne } = require("./Controller");
const { uploadMultipleImages } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const uploadMixImages = uploadMultipleImages(
    [{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 5 }],
    "products"
);

const resizeMixImages = asyncErrorHandler(async (req, res, next) => {
    if (req.files) {
        if (req.files.coverImage?.[0]) {
            req.body.coverImage = req.files.coverImage[0].path;
        }
        if (req.files.images?.length) {
            req.body.images = req.files.images.map((f) => f.path);
        }
    }
    next();
});

const getProducts  = getAll(Product);
const createProduct = createOne(Product);
const getProduct   = getOne(Product, "product", "reviews");
const updateProduct = updateOne(Product, "product");
const deleteProduct = deleteOne(Product, "product");

module.exports = {
    getProducts, createProduct, getProduct,
    updateProduct, deleteProduct,
    uploadMixImages, resizeMixImages,
};
