const { validationResult } = require("express-validator");
const CustomError = require("../utils/CustomError");

let validationMiddleware = function (req, res, next) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = errors.array().map(obj => obj.msg).join(" ");
        throw new CustomError(message, 400);
    }

    next();
}

module.exports = validationMiddleware;