const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require("./Controller");
const Review = require("../models/Review");


let getAllReviews = getAll(Review);

let createReview = createOne(Review);

let getReview = getOne(Review, "review");

let updateReview = updateOne(Review, "review")

let deleteReview = deleteOne(Review, "review");

module.exports = {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
};