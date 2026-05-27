const mongoose = require("mongoose");
const fs = require("fs");

let productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            minlength: [3, "Too short product name"],
            trim: true
        },
        slug: {
            type: String,
            lowercase: true
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minlength: [20, "Too short product description"],
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"]
        },
        sold: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, "Product price is required"]
        },
        priceAfterDiscount: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value <= this.price;
                },
                message: "priceAfterDiscount must be less than price."
            }
        },
        colors: [String],
        coverImage: {
            type: String,
            required: [true, "Product cover Image is required"]
        },
        images: [String],
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: [true, "Product must belong to category"]
        },
        subCategory: [{
            type: mongoose.Types.ObjectId,
            ref: "SubCategory"
        }],
        brand: {
            type: mongoose.Types.ObjectId,
            ref: "Brand"
        },
        avgRatings: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ─── Indexes ─────────────────────────────────────────────────
// category: أكثر فلتر مستخدم في الـ products page
productSchema.index({ category: 1 });

// price, priceAfterDiscount: للفلترة بالسعر وعروض الـ flash sales
productSchema.index({ price: 1 });
productSchema.index({ priceAfterDiscount: 1 });

// sold: للـ sort في Best Selling (sort: "-sold")
productSchema.index({ sold: -1 });

// createdAt: الـ sort الافتراضي في كل الـ queries (sort: "-createdAt")
productSchema.index({ createdAt: -1 });

// compound index: category + createdAt — للـ filtered + sorted queries
productSchema.index({ category: 1, createdAt: -1 });
// ─────────────────────────────────────────────────────────────

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "name -_id"
    });
    this.populate({
        path: "subCategory",
        select: "name -_id"
    });
    this.populate({
        path: "brand",
        select: "name -_id"
    });
    next()
});

let setImageUrl = function (doc) {
    if (doc.coverImage) {
        if (!doc.coverImage.startsWith("http")) {
            const cleanImage = doc.coverImage.replace(/^\/+/, "");
            doc.coverImage = `${process.env.BASE_URL}/products/${cleanImage}`;
        }
    }
    if (doc.images) {
        doc.images = doc.images.map(image => {
            if (!image.startsWith("http")) {
                const cleanImage = image.replace(/^\/+/, "");
                return `${process.env.BASE_URL}/products/${cleanImage}`;
            }
            return image;
        });
    }
};

productSchema.post("init", doc => setImageUrl(doc));

productSchema.post("save", doc => setImageUrl(doc));

productSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "product",
    localField: "_id"
});

productSchema.post(/delete/, async function (doc, next) {
    if (doc.coverImage) {
        if (!doc.coverImage.startsWith("http")) {
            fs.unlink(doc.coverImage, (err) => {
                if (err)
                    console.log(err.message);
            })
        }
    }
    next();
});

module.exports = mongoose.model("Product", productSchema);