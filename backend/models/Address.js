const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        alias: {
            type: String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = addressSchema;