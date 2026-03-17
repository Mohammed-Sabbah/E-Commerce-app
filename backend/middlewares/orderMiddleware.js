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

module.exports = {
    getOrdersMiddleware,
    updateOrdersPaidStatusMiddleware,
    updateOrdersDeliveredStatusMiddleware
}