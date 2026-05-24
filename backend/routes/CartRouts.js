const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    addToCartValidator,
    removeFromCartValidator,
    updateItemQuantityValidator,
    applyCouponOnCartValidator
} = require("../utils/validators/cartValidator");
const {
    getLoggedUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateItemQuantity,
    applyCouponOnCart
} = require("../controllers/CartController")

let router = express.Router();

router.use(
    protect,
    allowedTo("user")
);

router.route("/")
    .get(getLoggedUserCart)
    .post(addToCartValidator, addToCart)
    .patch(applyCouponOnCartValidator, applyCouponOnCart)
    .delete(clearCart);

router.route("/:id")
    .patch(updateItemQuantityValidator, updateItemQuantity)
    .delete(removeFromCartValidator, removeFromCart);

module.exports = router;