const express = require("express");

const {
    protect,
    allowedTo
} = require("../middlewares/authMiddleware");

const {
    removePasswordFromReqBody,
    myProfileMiddleware,
    deleteMeMiddleware,
    activateMiddleware,
    deactivateMiddleware,
    updateMeMiddleware
} = require("../middlewares/userMiddleware");

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator
} = require("../utils/validators/userValidator");

const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeUserImage,
    changePassword,
    deleteMe
} = require("../controllers/UserController");

let router = express.Router();

router.route("/myProfile")
    .get(
        protect,
        myProfileMiddleware,
        getUser
    );

router.route("/changePassword")
    .patch(
        protect,
        changePasswordValidator,
        changePassword
    );

router.route("/updateMe")
    .patch(
        protect,
        uploadUserImage,
        resizeUserImage,
        updateMeMiddleware,
        updateUserValidator,
        updateUser
    );

router.route("/deleteMe")
    .patch(
        protect,
        allowedTo("user", "teacher"),
        deleteMeMiddleware,
        deleteMe
    );

router.route("/")
    .get(getAllUsers)
    .post(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );

router.route("/:id/deactivate")
    .patch(
        protect,
        allowedTo("admin"),
        deactivateMiddleware,
        updateUser
    );

router.route("/:id/activate")
    .patch(
        protect,
        allowedTo("admin"),
        activateMiddleware,
        updateUser
    );

router.route("/:id")
    .get(getUserValidator, getUser)
    .patch(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeUserImage,
        removePasswordFromReqBody,
        updateUserValidator,
        updateUser
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteUserValidator,
        deleteUser
    );

module.exports = router;