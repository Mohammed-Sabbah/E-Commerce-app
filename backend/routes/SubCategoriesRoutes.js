const express = require("express");
const {
    addCategoryIdToReqBody,
    addFilterToReqBody
} = require("../middlewares/subCategoryMiddleware")
const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require("../utils/validators/subCategoryValidator");

const {
    getSubCategories,
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    uploadImage,
    resizeImage
} = require("../controllers/SubCategoriesController");
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const normalizeBilingualFields = require("../middlewares/normalizeBilingualFields");

let router = express.Router({ mergeParams: true });

router.route("/")
    .get(
        addFilterToReqBody,
        getSubCategories
    )
    .post(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        normalizeBilingualFields,
        addCategoryIdToReqBody,
        createSubCategoryValidator,
        createSubCategory
    );

router.route("/:id")
    .get(
        getSubCategoryValidator,
        getSubCategory
    )
    .patch(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        normalizeBilingualFields,
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSubCategory
    );

module.exports = router;