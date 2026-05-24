const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { createOrderValidator } = require("../utils/validators/orderValidator");
const { createCheckoutSession } = require("../controllers/PaymentController");

let router = express.Router();

router.route("/create-checkout-session")
    .post(
        protect,
        allowedTo("user"),
        createOrderValidator,
        createCheckoutSession
    );

module.exports = router;