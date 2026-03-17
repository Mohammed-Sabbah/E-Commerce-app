const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
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
        shippingAddress: {
            type: mongoose.Types.ObjectId,
            ref: "Address",
            required: true
        },
        orderPrice: {
            type: Number,
            required: true
        },
        taxValue: {
            type: Number,
            default: 0
        },
        shippingValue: {
            type: Number,
            default: 0
        },
        totalOrderPrice: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card"],
            default: "cash"
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false
        },
        deliveredAt: Date
    },
    {
        timestamps: true
    }
);

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name email coverImage"
    }).populate({
        path: "cartItems.product",
        select: "name coverImage"
    });
    next();
});

module.exports = mongoose.model("Order", orderSchema);