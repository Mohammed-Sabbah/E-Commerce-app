const Coupon = require("../models/Coupon");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");

let getAllCoupons = getAll(Coupon);

let createCoupon = createOne(Coupon);

let getCoupon = getOne(Coupon, "Coupon");

let updateCoupon = updateOne(Coupon, "Coupon")

let deleteCoupon = deleteOne(Coupon, "Coupon");

module.exports = {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
};