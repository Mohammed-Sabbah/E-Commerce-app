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
        status: {
            type: String,
            enum: ["pending", "processing", "delivered", "cancelled", "returned"],
            default: "pending"
        },
        stripeEventId: {
            type: String,
            unique: true,
            sparse: true  // sparse: cash orders don't have a stripe event ID
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

orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name email" });
    next();
});

module.exports = mongoose.model("Order", orderSchema);