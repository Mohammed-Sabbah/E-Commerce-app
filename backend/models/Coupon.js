const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        discount: {
            type: Number,
            max: 100,
            required: true
        },
        expire: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Coupon", couponSchema)