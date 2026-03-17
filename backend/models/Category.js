const mongoose = require("mongoose");
const fs = require("fs");

let categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "category name is required"],
            unique: [true, "category name must be unique"],
            minlength: [3, "category name length must be larger than 3 characters"],
            maxlength: [32, "category name length must be less than 32 characters"]
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
        let url = `${process.env.BASE_URL}/categories/${doc.photo}`;
        doc.photo = url;
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