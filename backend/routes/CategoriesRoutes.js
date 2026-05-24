const express = require("express");
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require("../utils/validators/categoryValidator");

const {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
    resizeImage
} = require("../controllers/CategoryController");

const subCategoriesRoutes = require("./SubCategoriesRoutes");
const {
    protect,
    allowedTo
} = require("../middlewares/authMiddleware");

let router = express.Router({ mergeParams: true });

router.use("/:categoryId/subCategories", subCategoriesRoutes);

router.route("/")
    .get(getCategories)
    .post(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

router.route("/:id")
    .get(
        getCategoryValidator,
        getCategory
    )
    .patch(
        protect,
        allowedTo("admin"),
        uploadImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory
    );


module.exports = router;