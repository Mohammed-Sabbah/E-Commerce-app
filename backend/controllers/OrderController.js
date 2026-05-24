const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const {
    getAll,
    getOne,
    updateOne
} = require("./Controller");
const CustomError = require("../utils/CustomError");
const getOrders = getAll(Order);
const createOrder = asyncErrorHandler(async function (req, res, next) {
    // 1- find cart with populated products
    const cart = await Cart.findOne({ user: req.user.id })
        .populate("cartItems.product");

    if (!cart) return next(new CustomError("No cart found", 404));

    // 2- build cartItems with correct price
    const cartItems = cart.cartItems.map(item => ({
        ...item.toObject(),
        price: item.product.priceAfterDiscount ?? item.product.price
    }));

    // 3- calculate orderPrice from items directly
    const orderPrice = parseFloat(
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    // 4- apply coupon ratio if exists
    let finalOrderPrice = orderPrice;
    if (cart.totalPriceAfterDiscount) {
        const discountRatio = cart.totalPriceAfterDiscount / cart.totalPrice;
        finalOrderPrice = parseFloat((orderPrice * discountRatio).toFixed(2));
    }

    // 5- build order body
    let orderBody = {
        user: cart.user,
        cartItems,
        orderPrice: finalOrderPrice,
        paymentMethod: req.body.paymentMethod ?? "cash",
        shippingAddress: req.body.shippingAddress
    };

    orderBody.taxValue = parseFloat((orderBody.orderPrice * 0.025).toFixed(2));
    orderBody.shippingValue = parseFloat((orderBody.orderPrice * 0.025).toFixed(2));
    orderBody.totalOrderPrice = parseFloat(
        (orderBody.orderPrice + orderBody.taxValue + orderBody.shippingValue).toFixed(2)
    );

    const order = await Order.create(orderBody);

    // 6- decrement quantities & increment sold
    cart.cartItems.forEach(async item =>
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { quantity: -item.quantity, sold: item.quantity }
        })
    );

    // 7- clear cart
    await Cart.findByIdAndDelete(cart.id);

    res.status(201).json({ status: "success", data: { order } });
});

const getOrder = getOne(Order, "order");

const updateOrder = updateOne(Order, "order");

const cancelOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order)
        return next(new CustomError("No order found", 404));

    if (order.user._id.toString() !== req.user.id)
        return next(new CustomError("This order does not belong to you", 403));

    if (order.status !== "pending")
        return next(new CustomError("Only pending orders can be cancelled", 400));

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ status: "success", data: { order } });
});

const returnOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order)
        return next(new CustomError("No order found", 404));

    if (order.user._id.toString() !== req.user.id)
        return next(new CustomError("This order does not belong to you", 403));

    if (order.status !== "delivered")
        return next(new CustomError("Only delivered orders can be returned", 400));

    const deliveredAt = new Date(order.deliveredAt);
    const now = new Date();
    const diffDays = (now - deliveredAt) / (1000 * 60 * 60 * 24);

    if (diffDays > 7)
        return next(new CustomError("Return window has expired (7 days)", 400));

    order.status = "returned";
    await order.save();

    res.status(200).json({ status: "success", data: { order } });
});

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
    cancelOrder,
    returnOrder
};
