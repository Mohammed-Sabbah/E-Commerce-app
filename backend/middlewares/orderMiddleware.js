const getOrdersMiddleware = (req, res, next) => {
    if (req.user.role === "user") {
        req.filterObj = { user: req.user._id };
    }
    next();
}

const updateOrdersPaidStatusMiddleware = (req, res, next) => {
    req.body = { isPaid: true, paidAt: Date.now() };
    next();
}

const updateOrdersDeliveredStatusMiddleware = (req, res, next) => {
    req.body = { isDelivered: true, deliveredAt: Date.now() };
    next();
}

const updateOrderStatusMiddleware = (req, res, next) => {
    const { status } = req.body;
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
}

module.exports = {
    getOrdersMiddleware,
    updateOrdersPaidStatusMiddleware,
    updateOrdersDeliveredStatusMiddleware,
    updateOrderStatusMiddleware
}