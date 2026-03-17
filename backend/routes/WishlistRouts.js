const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { wishlistValidator } = require("../utils/validators/wishlistValidator");
const {
    addToWishlist,
    removeFromWishlist,
    getLoggedUserWishlist
} = require("../controllers/WishlistController")

let router = express.Router();

router.use(
    protect,
    allowedTo("user")
);

router.route("/")
    .get(getLoggedUserWishlist)
    .post(
        wishlistValidator,
        addToWishlist
    );

router.route("/:productId")
    .delete(
        wishlistValidator,
        removeFromWishlist
    );

module.exports = router;