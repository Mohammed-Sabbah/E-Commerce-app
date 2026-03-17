const bcryptjs = require('bcryptjs');
const fs = require("fs");
const mongoose = require('mongoose');
const addressSchema = require("./Address");

let userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        googleId: String,
        facebookId: String,
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        profileImage: String,
        password: {
            type: String,
            trim: true,
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        wishlist: [{
            type: mongoose.Types.ObjectId,
            ref: "Product"
        }],
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetVerified: Boolean,
        passwordResetCodeExpires: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        addresses: [addressSchema]
    },
    {
        timestamps: true,
    }
);

let setImageUrl = function (doc) {
    if (doc.profileImage) {
        if (!doc.profileImage.startsWith("http")) {
            let url = `${process.env.BASE_URL}/users/${doc.profileImage}`;
            doc.profileImage = url;
        }
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcryptjs.hashSync(this.password, 10);
    }

    next();
});

userSchema.post('init', doc => setImageUrl(doc));

userSchema.post('save', doc => setImageUrl(doc));

userSchema.post(/delete/, async function (doc, next) {
    if (doc.profileImage) {
        if (!doc.profileImage.startsWith("http")) {
            fs.unlink(doc.profileImage, (err) => {
                if (err)
                    console.log(err.message);
            })
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);