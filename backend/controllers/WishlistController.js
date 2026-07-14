const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const { localizeProductRef } = require("../utils/localizeField");

const addToWishlist = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $addToSet: { wishlist: req.body.productId }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings quantity");

    const localizedWishlist = user.wishlist.map(p => localizeProductRef(p, lang));

    res.status(200).json({
        status: "success",
        data: {
            wishlist: localizedWishlist
        }
    });
});

const removeFromWishlist = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $pull: { wishlist: req.params.productId }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings quantity");

    const localizedWishlist = user.wishlist.map(p => localizeProductRef(p, lang));

    res.status(200).json({
        status: "success",
        data: {
            wishlist: localizedWishlist
        }
    });
});

const getLoggedUserWishlist = asyncErrorHandler(async function (req, res) {
    const lang = req.query.lang || "en";
    let user = await User.findById(req.user.id)
        .populate("wishlist", "_id name price priceAfterDiscount coverImage avgRatings");

    const localizedWishlist = user.wishlist.map(p => localizeProductRef(p, lang));

    res.status(200).json({
        status: "success",
        data: {
            wishlist: localizedWishlist
        }
    });
});

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getLoggedUserWishlist
}
