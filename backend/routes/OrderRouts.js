const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    getOrdersMiddleware,
    updateOrdersPaidStatusMiddleware,
    updateOrdersDeliveredStatusMiddleware
} = require("../middlewares/orderMiddleware");
const {
    createOrderValidator,
    getOrderValidator,
    updateOrdersPaidStatusValidator,
    updateOrdersDeliveredStatusValidator
} = require("../utils/validators/orderValidator");
const {
    getOrders,
    createOrder,
    getOrder,
    updateOrder
} = require("../controllers/OrderController");

let router = express.Router();

router.use(protect);

router.route("/")
    .get(
        getOrdersMiddleware,
        getOrders
    )
    .post(
        allowedTo("user"),
        createOrderValidator,
        createOrder
    );

router.route("/:id/pay")
    .patch(
        allowedTo("admin"),
        updateOrdersPaidStatusMiddleware,
        updateOrdersPaidStatusValidator,
        updateOrder
    );

router.route("/:id/deliver")
    .patch(
        allowedTo("admin"),
        updateOrdersDeliveredStatusMiddleware,
        updateOrdersDeliveredStatusValidator,
        updateOrder
    );

router.route("/:id")
    .get(
        getOrderValidator,
        getOrder
    );

module.exports = router;