const mongoose = require("mongoose");
const fs = require("fs");

let brandSchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: [true, "brand name (English) is required"], unique: true, minlength: [3, "name length must be larger than 3"], maxlength: [32, "name length must be less than 32"], trim: true },
            ar: { type: String, required: [true, "brand name (Arabic) is required"], minlength: [3, "name length must be larger than 3"], maxlength: [32, "name length must be less than 32"], trim: true }
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

brandSchema.post("init", doc => setImageUrl(doc));

brandSchema.post("save", doc => setImageUrl(doc));

brandSchema.post(/delete/, async function (doc, next) {
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

module.exports = mongoose.model("Brand", brandSchema);