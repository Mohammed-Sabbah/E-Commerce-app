const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const addToWishlist = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $addToSet: { wishlist: req.body.productId }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings");

    res.status(200).json({
        status: "success",
        data: {
            wishlist: user.wishlist
        }
    });
});

const removeFromWishlist = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $pull: { wishlist: req.params.productId }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings");

    res.status(200).json({
        status: "success",
        data: {
            wishlist: user.wishlist
        }
    });
});

const getLoggedUserWishlist = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id)
        .populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings");

    res.status(200).json({
        status: "success",
        data: {
            wishlist: user.wishlist
        }
    });
});

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getLoggedUserWishlist
}