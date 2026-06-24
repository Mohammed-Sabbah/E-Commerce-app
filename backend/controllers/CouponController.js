const Coupon = require("../models/Coupon");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require("./Controller");
const CustomError = require("../utils/CustomError");

let getAllCoupons = getAll(Coupon);

let createCoupon = createOne(Coupon);

let getCoupon = getOne(Coupon, "Coupon");

let updateCoupon = updateOne(Coupon, "Coupon")

let deleteCoupon = deleteOne(Coupon, "Coupon");

const validateCoupon = asyncErrorHandler(async (req, res) => {
    const coupon = await Coupon.findOne({
        name: req.body.code,
        expire: { $gte: Date.now() }
    });

    if (!coupon)
        throw new CustomError("Invalid or expired coupon", 400);

    res.status(200).json({
        status: "success",
        data: {
            valid: true,
            discount: coupon.discount,
            name: coupon.name
        }
    });
});

module.exports = {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};