const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
} = require("../utils/validators/couponValidator");
const {
    getAllCoupons,
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
} = require("../controllers/CouponController");

let router = express.Router();

router.use(protect, allowedTo("admin"));

router.route("/")
    .get(getAllCoupons)
    .post(createCouponValidator, createCoupon);

router.route("/:id")
    .get(getCouponValidator, getCoupon)
    .patch(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;