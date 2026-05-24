const crypto = require("crypto");
const sharp = require("sharp");
const Product = require("../models/Product");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");
const { uploadMultipleImages } = require("../middlewares/uploadImagesMiddleware");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");


let uploadMixImages = uploadMultipleImages([
    {
        name: "coverImage",
        maxCount: 1
    },
    {
        name: "images",
        maxCount: 5
    }
]);

let resizeMixImages = asyncErrorHandler(async function (req, res, next) {
    if (req.files) {
        if (req.files.coverImage) {
            let uniqe = crypto.randomBytes(9).toString("hex");
            let fileName = `products-${uniqe}-${Date.now()}-cover.jpeg`;

            await sharp(req.files.coverImage[0].buffer)
                .resize(600, 600)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`uploads/products/${fileName}`);

            req.body.coverImage = fileName;
        }

        if (req.files.images) {

            let names = [];
            let uniqe = crypto.randomBytes(9).toString("hex");
            await Promise.all(
                await req.files.images.map(async (image, index) => {
                    let fileName = `products-${uniqe}-${Date.now()}-${index + 1}.jpeg`;

                    await sharp(image.buffer)
                        .resize(600, 600)
                        .toFormat("jpeg")
                        .jpeg({ quality: 90 })
                        .toFile(`uploads/products/${fileName}`);

                    names.push(fileName)
                })
            )
            req.body.images = names;
        }

    }
    next();
});

let getProducts = getAll(Product);

let createProduct = createOne(Product);

let getProduct = getOne(Product, "product", "reviews");

let updateProduct = updateOne(Product, "product");

let deleteProduct = deleteOne(Product, "product")

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadMixImages,
    resizeMixImages
}