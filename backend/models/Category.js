const mongoose = require("mongoose");
const fs = require("fs");

let categorySchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: [true, "category name (English) is required"], unique: true, minlength: [3, "category name must be larger than 3"], maxlength: [32, "category name must be less than 32"], trim: true },
            ar: { type: String, required: [true, "category name (Arabic) is required"], minlength: [3, "category name must be larger than 3"], maxlength: [32, "category name must be less than 32"], trim: true }
        },
        slug: {
            type: String,
            lowercase: true
        },
        photo: String
    },
    {
        timestamps: true
    }
);

let setImageUrl = function (doc) {
    if (doc.photo) {
        if (!doc.photo.startsWith("http")) {
            doc.photo = `${process.env.BASE_URL}/${doc.photo}`;
        }
    }
};

categorySchema.post("init", doc => setImageUrl(doc));

categorySchema.post("save", doc => setImageUrl(doc));

categorySchema.post(/delete/, async function (doc, next) {
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

module.exports = mongoose.model("Category", categorySchema);
