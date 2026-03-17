const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const CustomError = require("../utils/CustomError");


const getLoggedUserCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    });
});

const addToCart = asyncErrorHandler(async function (req, res) {
    const { product: productId, quantity, color } = req.body;

    const product = await Product.findById(productId);
    let cart = await Cart.findOne({ user: req.user });

    // 1- user don't have cart
    if (!cart) {
        cart = await Cart.create({
            cartItems: [
                {
                    product: productId,
                    quantity: quantity || 1,
                    color,
                    price: product.price
                }
            ],
            totalPrice: product.price,
            user: req.user.id
        });
    }
    else {
        let productIds = cart.cartItems.map(item => item.product.toString());
        // 2- user have cart & item does not exist in the cart
        if (!productIds.includes(productId)) {
            cart = await Cart.findByIdAndUpdate(cart.id,
                {
                    $addToSet: {
                        cartItems: {
                            product: productId,
                            quantity: quantity || 1,
                            color,
                            price: product.price
                        },
                    },
                    totalPrice: (cart.totalPrice + product.price)
                },
                {
                    runValidators: true,
                    new: true
                }
            );
        }
        // 3- user have cart & item exist in the cart with the same color
        else {
            let index = cart.cartItems.findIndex(item => item.product.toString() === productId && item.color === color);
            if (index !== -1) {
                cart.cartItems[index].quantity += 1;
                cart.totalPrice += product.price;
                await cart.save();
            }
            // 4- user have cart & item exist in the cart with another color
            else {
                cart = await Cart.findByIdAndUpdate(cart.id,
                    {
                        $addToSet: {
                            cartItems: {
                                product: productId,
                                quantity: quantity || 1,
                                color,
                                price: product.price
                            },
                        },
                        totalPrice: (cart.totalPrice + product.price)
                    },
                    {
                        runValidators: true,
                        new: true
                    }
                );
            }
        }
    }

    res.status(201).json({
        status: "success",
        data: {
            cart
        }
    });
});

const removeFromCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user });

    let index = cart.cartItems.findIndex(item => item.id === req.params.id);
    let item = cart.cartItems[index];
    if (index > -1) {
        cart.cartItems.pull(item);
        cart.totalPrice -= (item.price * item.quantity);
        await cart.save();
    }

    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    });
});

const clearCart = asyncErrorHandler(async function (req, res) {
    await Cart.findOneAndDelete({ user: req.user });
    res.status(204).send();
});

const updateItemQuantity = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user });

    let index = cart.cartItems.findIndex(item => item.id === req.params.id);
    let item = cart.cartItems[index];
    if (index > -1) {
        cart.totalPrice -= (item.price * item.quantity);
        item.quantity = req.body.quantity;
        cart.totalPrice += (item.price * item.quantity);
        await cart.save();
    }

    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    });
});

const applyCouponOnCart = asyncErrorHandler(async function (req, res) {
    const coupon = await Coupon.findOne({ name: req.body.coupon });
    let cart = await Cart.findOne({ user: req.user });

    if (cart.appliedCoupons.includes(coupon.id))
        throw new CustomError(`You have applied this coupon '${coupon.name}' before!`, 400);

    cart.totalPriceAfterDiscount = parseFloat((cart.totalPrice - (cart.totalPrice * (coupon.discount / 100))).toFixed(2));
    cart.appliedCoupons.push(coupon.id);
    cart.save();

    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    });
});

module.exports = {
    getLoggedUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateItemQuantity,
    applyCouponOnCart
}