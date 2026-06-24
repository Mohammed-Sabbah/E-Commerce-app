const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    getOrdersMiddleware,
    updateOrdersPaidStatusMiddleware,
    updateOrderStatusMiddleware
} = require("../middlewares/orderMiddleware");
const {
    createOrderValidator,
    getOrderValidator,
    updateOrdersPaidStatusValidator,
    cancelOrderValidator,
    returnOrderValidator,
    updateOrderStatusValidator
} = require("../utils/validators/orderValidator");
const {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
    cancelOrder,
    returnOrder
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

router.route("/:id/cancel")
    .patch(
        allowedTo("user"),
        cancelOrderValidator,
        cancelOrder
    );

router.route("/:id/return")
    .patch(
        allowedTo("user"),
        returnOrderValidator,
        returnOrder
    );

router.route("/:id")
    .get(
        getOrderValidator,
        getOrder
    );

router.route("/:id/status")
    .patch(
        allowedTo("admin"),
        updateOrderStatusValidator,
        updateOrderStatusMiddleware,
        updateOrder
    );

module.exports = router;