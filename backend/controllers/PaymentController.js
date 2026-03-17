const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

const createCheckoutSession = asyncErrorHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate("cartItems.product");

    const orderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const taxValue = parseFloat((orderPrice * 0.025).toFixed(2));
    const shippingValue = parseFloat((orderPrice * 0.025).toFixed(2));
    const totalOrderPrice = orderPrice + taxValue + shippingValue;

    const lineItems = cart.cartItems.map((item) => ({
        price_data: {
            currency: 'ils',
            product_data: {
                name: item.product.name,
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    lineItems.push(
        {
            price_data: {
                currency: 'ils',
                product_data: { name: 'Shipping Fee' },
                unit_amount: Math.round(shippingValue * 100),
            },
            quantity: 1,
        },
        {
            price_data: {
                currency: 'ils',
                product_data: { name: 'Tax' },
                unit_amount: Math.round(taxValue * 100),
            },
            quantity: 1,
        }
    );

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        client_reference_id: req.user.id,
        metadata: {
            user: req.user.id,
            cartId: cart.id,
            shippingAddress: req.body.shippingAddress,
            orderPrice: orderPrice.toString(),
            taxValue: taxValue.toString(),
            shippingValue: shippingValue.toString(),
            totalOrderPrice: totalOrderPrice.toString(),
        },
    });

    res.status(201).json({
        status: 'success',
        sessionUrl: session.url,
    });
});

const webhook = asyncErrorHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const {
            user,
            cartId,
            shippingAddress,
            orderPrice,
            taxValue,
            shippingValue,
            totalOrderPrice
        } = session.metadata;

        // 1- find cart
        const cart = await Cart.findById(cartId).populate("cartItems.product");

        // 2-create order
        await Order.create({
            user,
            cartItems: cart.cartItems,
            paymentMethod: "card",
            shippingAddress: shippingAddress,
            orderPrice: parseFloat(orderPrice),
            taxValue: parseFloat(taxValue),
            shippingValue: parseFloat(shippingValue),
            totalOrderPrice: parseFloat(totalOrderPrice),
            isPaid: true,
            paidAt: Date.now()
        });

        // 3- decrement quantities & increment sold
        const updatePromises = cart.cartItems.map(item =>
            Product.findByIdAndUpdate(item.product._id, { $inc: { quantity: -item.quantity, sold: item.quantity } }));
        await Promise.all(updatePromises);

        // 4- clear Cart
        await Cart.findByIdAndDelete(cart._id);
    }

    res.status(200).json({ status: "Received" });
});

module.exports = { createCheckoutSession, webhook };
