const express = require("express");

const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require("../utils/validators/productValidator");

const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadMixImages,
    resizeMixImages
} = require("../controllers/ProductController");

const {
    allowedTo,
    protect
} = require("../middlewares/authMiddleware");

const reviewsRoutes = require("./ReviewRoutes");

let router = express.Router();

router.use("/:productId/reviews", reviewsRoutes);

router.route("/")
    .get(getProducts)
    .post(
        protect,
        allowedTo("admin"),
        uploadMixImages,
        resizeMixImages,
        createProductValidator,
        createProduct
    );

router.route("/:id")
    .get(getProductValidator, getProduct)
    .patch(
        protect,
        allowedTo("admin"),
        uploadMixImages,
        resizeMixImages,
        updateProductValidator,
        updateProduct
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;