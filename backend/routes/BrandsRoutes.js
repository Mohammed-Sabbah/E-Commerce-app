const express = require("express");

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require("../utils/validators/brandValidator");

const {
    getAllBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadImage,
    resizeImage
} = require("../controllers/BrandController");

const {
    protect,
    allowedTo
} = require("../middlewares/authMiddleware");

let router = express.Router();

router.route("/")
    .get(getAllBrands)
    .post(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        createBrandValidator,
        createBrand
    );

router.route("/:id")
    .get(getBrandValidator, getBrand)
    .patch(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteBrandValidator,
        deleteBrand
    );

module.exports = router;