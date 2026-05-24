const express = require("express");

const {
    protect,
    allowedTo
} = require("../middlewares/authMiddleware");

const {
    addUserIdToReqBody,
    addProductIdToReqBody,
} = require("../middlewares/reviewMiddleware");

const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require("../utils/validators/reviewValidator");

const {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/ReviewController");

let router = express.Router({ mergeParams: true });

router.route("/")
    .get(getAllReviews)
    .post(
        protect,
        allowedTo("user"),
        addUserIdToReqBody,
        addProductIdToReqBody,
        createReviewValidator,
        createReview
    );

router.route("/:id")
    .get(
        getReviewValidator,
        getReview
    )
    .patch(
        protect,
        allowedTo("user"),
        addUserIdToReqBody,
        addProductIdToReqBody,
        updateReviewValidator,
        updateReview
    )
    .delete(
        protect,
        addUserIdToReqBody,
        addProductIdToReqBody,
        deleteReviewValidator,
        deleteReview
    );

module.exports = router;