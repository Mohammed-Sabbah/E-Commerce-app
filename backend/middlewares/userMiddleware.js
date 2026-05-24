const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./ErrorMiddleware");

let removePasswordFromReqBody = function (req, res, next) {
    if (req.body.password) {
        delete req.body.password;
    }
    if (req.body.confirmPassword) {
        delete req.body.confirmPassword;
    }
    next();
}

let myProfileMiddleware = function (req, res, next) {
    req.params.id = req.user.id;
    next();
}

let updateMeMiddleware = asyncErrorHandler(async function (req, res, next) {
    req.params.id = req.user.id;
    if (req.body.password || req.body.confirmPassword)
        throw new CustomError("You can not change your password from here!", 403);
    if (req.body.role)
        throw new CustomError("You can not change your role!", 403);
    next();
});

let deleteMeMiddleware = function (req, res, next) {
    req.body = { isActive: false };
    req.params.id = req.user.id;
    next();
}

let activateMiddleware = function (req, res, next) {
    req.body = { isActive: true };
    next();
}

let deactivateMiddleware = function (req, res, next) {
    req.body = { isActive: false };
    next();
}

module.exports = {
    removePasswordFromReqBody,
    myProfileMiddleware,
    deleteMeMiddleware,
    activateMiddleware,
    deactivateMiddleware,
    updateMeMiddleware
}