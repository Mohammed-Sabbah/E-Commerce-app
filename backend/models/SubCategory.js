const mongoose = require('mongoose');
const fs = require("fs");

let subCategorySchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: [true, "subCategory name (English) is required"], unique: true, minlength: [3, "subCategory name must be larger than 3"], maxlength: [32, "subCategory name must be less than 32"], trim: true },
            ar: { type: String, required: [true, "subCategory name (Arabic) is required"], minlength: [3, "subCategory name must be larger than 3"], maxlength: [32, "subCategory name must be less than 32"], trim: true }
        },
        slug: {
            type: String,
            lowercase: true
        },
        photo: String,
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: [true, "SubCategory must belong to parent category"]
        }
    },
    {
        timestamps: true
    }
);


let setImageUrl = function (doc) {
    if (doc.photo) {
        if (doc.photo.includes("/subCategories/https://") || doc.photo.includes("/subCategories/http://")) {
            doc.photo = doc.photo.split("/subCategories/")[1];
        }
        if (!doc.photo.startsWith("http")) {
            let url = `${process.env.BASE_URL}/subCategories/${doc.photo}`;
            doc.photo = url;
        }
    }
};

subCategorySchema.post("init", doc => setImageUrl(doc));

subCategorySchema.post("save", doc => setImageUrl(doc));

subCategorySchema.post(/delete/, async function (doc, next) {
    if (doc.photo) {
        if (!doc.photo.startsWith("http")) {
            fs.unlink(doc.photo, (err) => {
                if (err)
                    console.log(err.message);
            })
        }
    }
    next();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
