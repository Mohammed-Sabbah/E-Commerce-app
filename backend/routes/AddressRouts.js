const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    getAddressValidator,
    createAddressValidator,
    updateAddressValidator,
    deleteAddressValidator
} = require("../utils/validators/addressValidator");
const {
    getUserAddresses,
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress
} = require("../controllers/AddressController");


let router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/")
    .get(getUserAddresses)
    .post(
        createAddressValidator,
        createAddress
    );

router.route("/:id")
    .get(
        getAddressValidator,
        getAddress
    ).patch(
        updateAddressValidator,
        updateAddress
    )
    .delete(
        deleteAddressValidator,
        deleteAddress
    );

module.exports = router;