const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Cart = require("../../models/Cart");
const CustomError = require("../CustomError");
const Order = require("../../models/Order");

const createOrderValidator = [
    validator.check("user")
        .custom(async (value, { req }) => {
            const cart = await Cart.findOne({ user: req.user.id }).populate("cartItems.product");

            if (!cart || cart.cartItems.length === 0)
                throw new CustomError("The cart is empty", 400);

            cart.cartItems.forEach(item => {

                if (item.product.quantity < item.quantity)
                    throw new CustomError(`There is no enough quantity for the ${item.color} ${item.product.name}`, 400);
            });
            return true;
        }),

    validator.check("paymentMethod")
        .optional()
        .isIn(["cash", "card"])
        .withMessage("invalid payment Method"),

    validator.check("shippingAddress")
        .notEmpty()
        .withMessage("shipping address is required.")
        .isMongoId()
        .withMessage("invalid shipping address id")
        .custom(async (value, { req }) => {
            let addresses = req.user.addresses.map(address => address.id)
            if (!addresses.includes(value))
                throw new CustomError("This address does not belong to the user", 400);

            return true;
        }),

    validationMiddleware
]

const getOrderValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Order id is required.")
        .isMongoId()
        .withMessage("invalid Order id")
        .custom(async (value, { req }) => {
            if (req.user.role === "user") {
                let order = await Order.findById(value);
                if (!order)
                    throw new CustomError("No order found", 404);

                if (order.user._id.toString() !== req.user.id)
                    throw new CustomError("This order does not belong to you", 403);
            }

            return true;
        }),

    validationMiddleware
]

const updateOrdersPaidStatusValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Order id is required.")
        .isMongoId()
        .withMessage("invalid Order id")
        .custom(async (value) => {
            let order = await Order.findById(value);
            if (!order)
                throw new CustomError("No order found", 404);

            if (order.isPaid)
                throw new CustomError("Paid status order has been updated before.", 403);

            return true;
        }),

    validationMiddleware
]

const updateOrdersDeliveredStatusValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Order id is required.")
        .isMongoId()
        .withMessage("invalid Order id")
        .custom(async (value) => {
            let order = await Order.findById(value);
            if (!order)
                throw new CustomError("No order found", 404);

            if (order.isDelivered)
                throw new CustomError("Delivered status order has been updated before.", 403);

            return true;
        }),

    validationMiddleware
]


module.exports = {
    createOrderValidator,
    getOrderValidator,
    updateOrdersPaidStatusValidator,
    updateOrdersDeliveredStatusValidator
}