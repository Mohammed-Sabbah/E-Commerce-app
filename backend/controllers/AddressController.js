const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const CustomError = require("../utils/CustomError");

const getUserAddresses = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id);

    res.status(200).json({
        status: "success",
        count: user.addresses.length,
        data: {
            addresses: user.addresses
        }
    });
});

const createAddress = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { addresses: req.body } },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        count: user.addresses.length,
        data: {
            addresses: user.addresses
        }
    });
});

const getAddress = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id);

    let address = user.addresses.find(add => add._id.toString() === req.params.id);

    if (!address)
        throw new CustomError("No address found", 404);

    res.status(200).json({
        status: "success",
        data: {
            address
        }
    });
});

const updateAddress = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id);

    let index = user.addresses.findIndex(add => add._id.toString() === req.params.id);

    if (index == -1)
        throw new CustomError("No address found", 404);

    if (!req.body.alias)
        req.body.alias = user.addresses[index].alias;

    if (!req.body.details)
        req.body.details = user.addresses[index].details;

    if (!req.body.phone)
        req.body.phone = user.addresses[index].phone;

    if (!req.body.city)
        req.body.city = user.addresses[index].city;

    if (!req.body.postalCode)
        req.body.postalCode = user.addresses[index].postalCode;

    user.addresses[index] = { ...user.addresses[index], ...req.body };

    if (user.profileImage) {
        if (user.profileImage.startsWith("http"))
            user.profileImage = user.profileImage.split("/").pop();
    }
    await user.save();

    res.status(200).json({
        status: "success",
        data: {
            updatedAddress: user.addresses[index]
        }
    });
});


const deleteAddress = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { addresses: { _id: req.params.id } } },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        addresses: user.addresses
    })
});

module.exports = {
    getUserAddresses,
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress
}
