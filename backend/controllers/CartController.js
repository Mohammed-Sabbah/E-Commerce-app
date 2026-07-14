const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const CustomError = require("../utils/CustomError");
const { localizeProductRef } = require("../utils/localizeField");

async function recalculateDiscount(cart) {
    if (!cart.appliedCoupons || cart.appliedCoupons.length === 0) {
        cart.totalPriceAfterDiscount = undefined;
        return;
    }
    const coupons = await Coupon.find({ _id: { $in: cart.appliedCoupons } });
    const totalDiscountPercent = coupons.reduce((sum, c) => sum + c.discount, 0);
    cart.totalPriceAfterDiscount = parseFloat(
        (cart.totalPrice - (cart.totalPrice * (totalDiscountPercent / 100))).toFixed(2)
    );
}

function localizeCartItems(cart, lang) {
    const cartObj = cart.toObject({ virtuals: true });
    cartObj.cartItems = cartObj.cartItems.map(item => ({
        ...item,
        product: item.product && item.product._id
            ? localizeProductRef(item.product, lang)
            : item.product
    }));
    return cartObj;
}

const getLoggedUserCart = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let cart = await Cart.findOne({ user: req.user.id })
        .populate({
            path: "cartItems.product",
            select: "name price priceAfterDiscount coverImage slug",
        });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id
        });
    }

    const cartObj = localizeCartItems(cart, lang);

    res.status(200).json({
        status: "success",
        data: {
            cart: cartObj
        }
    });
});

const addToCart = asyncErrorHandler(async function (req, res) {
    const { productId, quantity, color } = req.body;
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

    await recalculateDiscount(cart);
    await cart.save();

    const lang = req.query.lang || "en";
    cart = await Cart.findById(cart._id || cart.id).populate("cartItems.product");
    const cartObj = localizeCartItems(cart, lang);

    res.status(201).json({
        status: "success",
        data: {
            cart: cartObj
        }
    });
});

const removeFromCart = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let cart = await Cart.findOne({ user: req.user });

    let index = cart.cartItems.findIndex(item => item.id === req.params.id);
    let item = cart.cartItems[index];
    if (index > -1) {
        cart.cartItems.pull(item);
        cart.totalPrice -= (item.price * item.quantity);
        await recalculateDiscount(cart);
        await cart.save();
    }

    cart = await Cart.findById(cart._id || cart.id).populate("cartItems.product");
    const cartObj = localizeCartItems(cart, lang);

    res.status(200).json({
        status: "success",
        data: {
            cart: cartObj
        }
    });
});

const clearCart = asyncErrorHandler(async function (req, res) {
    await Cart.findOneAndDelete({ user: req.user });
    res.status(204).send();
});

const updateItemQuantity = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let cart = await Cart.findOne({ user: req.user });

    let index = cart.cartItems.findIndex(item => item.id === req.params.id);
    let item = cart.cartItems[index];
    if (index > -1) {
        cart.totalPrice -= (item.price * item.quantity);
        item.quantity = req.body.quantity;
        cart.totalPrice += (item.price * item.quantity);
        await recalculateDiscount(cart);
        await cart.save();
    }

    cart = await Cart.findById(cart._id || cart.id).populate("cartItems.product");
    const cartObj = localizeCartItems(cart, lang);

    res.status(200).json({
        status: "success",
        data: {
            cart: cartObj
        }
    });
});

const applyCouponOnCart = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    const coupon = await Coupon.findOne({ name: req.body.coupon, expire: { $gte: Date.now() } });
    if (!coupon)
        throw new CustomError("Invalid or expired coupon", 400);

    let cart = await Cart.findOne({ user: req.user });

    if (cart.appliedCoupons.includes(coupon.id))
        throw new CustomError(`You have applied this coupon '${coupon.name}' before!`, 400);

    cart.appliedCoupons.push(coupon.id);
    await recalculateDiscount(cart);
    await cart.save();

    cart = await Cart.findById(cart._id || cart.id).populate("cartItems.product");
    const cartObj = localizeCartItems(cart, lang);

    res.status(200).json({
        status: "success",
        data: {
            cart: cartObj
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
