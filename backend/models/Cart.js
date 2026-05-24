const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        cartItems: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            price: Number,
            quantity: {
                type: Number,
                default: 0
            },
            color: String
        }],
        totalPrice: {
            type: Number,
            default: 0
        },
        totalPriceAfterDiscount: Number,
        appliedCoupons: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Coupon"
            }
        ],
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", cartSchema);