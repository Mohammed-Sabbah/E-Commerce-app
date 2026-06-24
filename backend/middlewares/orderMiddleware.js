const { asyncErrorHandler } = require("./ErrorMiddleware");

const getOrdersMiddleware = (req, res, next) => {
    if (req.user.role === "user") {
        req.filterObj = { user: req.user._id };
    }
    next();
}

const updateOrdersPaidStatusMiddleware = asyncErrorHandler(async (req, res, next) => {
    const CustomError = require("../utils/CustomError");
    const Order = require("../models/Order");
    const order = await Order.findById(req.params.id);
    if (!order) return next(new CustomError("No order found", 404));
    if (order.status === "cancelled" || order.status === "returned")
        return next(new CustomError("Cannot pay a cancelled or returned order", 400));
    if (order.isPaid)
        return next(new CustomError("Order has already been paid", 400));
    req.body = { isPaid: true, paidAt: Date.now() };
    next();
})

const updateOrdersDeliveredStatusMiddleware = (req, res, next) => {
    req.body = { isDelivered: true, deliveredAt: Date.now() };
    next();
}

const updateOrderStatusMiddleware = asyncErrorHandler(async (req, res, next) => {
    const { status } = req.body;
    const CustomError = require("../utils/CustomError");
    const Order = require("../models/Order");

    const order = await Order.findById(req.params.id);
    if (!order) return next(new CustomError("No order found", 404));

    const VALID_TRANSITIONS = {
        pending:    ["processing", "cancelled"],
        processing: ["delivered", "cancelled"],
        delivered:  ["returned"],
        cancelled:  [],
        returned:   [],
    };

    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
        return next(
            new CustomError(
                `Cannot transition from "${order.status}" to "${status}"`,
                400
            )
        );
    }

    const payload = { status };
    if (status === "delivered") {
        payload.isDelivered = true;
        payload.deliveredAt = Date.now();
    }
    if (status === "returned" || status === "cancelled") {
        payload.isDelivered = false;
        payload.deliveredAt = null;
    }

    req.body = payload;
    next();
});

module.exports = {
    getOrdersMiddleware,
    updateOrdersPaidStatusMiddleware,
    updateOrdersDeliveredStatusMiddleware,
    updateOrderStatusMiddleware
}
