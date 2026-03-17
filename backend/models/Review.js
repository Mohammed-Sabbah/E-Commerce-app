const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        }
    },
    {
        timestamps: true,
    }
);

reviewSchema.pre(/^find/, function (next) {
    this
        .populate({
            path: "user",
            select: "id name profileImage"
        })

    next();
});

reviewSchema.statics.calculateSumAndAvgOfRatings = async function (productId) {
    let product = await Product.findById(productId)
    let result = await this.aggregate([
        { $match: { product: { $eq: productId } } },
        {
            $group: {
                _id: "$product",
                avgRatings: { $avg: "$rating" },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ]);
    if (result.length > 0) {
        product.ratingsQuantity = result[0].ratingsQuantity;
        product.avgRatings = result[0].avgRatings;
    }
    else {
        product.ratingsQuantity = 0;
        product.avgRatings = 0;
    }

    if (product.coverImage)
        if (product.coverImage.startsWith("http"))
            product.coverImage = product.coverImage.split("/").pop();

    if (product.images) {
        product.images = product.images.map(image => {
            if (image.startsWith("http")) {
                return image.split("/").pop();
            }
            return image;
        });
    }
    await product.save();
}

reviewSchema.post("save", async function (doc) {
    await doc.constructor.calculateSumAndAvgOfRatings(doc.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
    await doc.constructor.calculateSumAndAvgOfRatings(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);