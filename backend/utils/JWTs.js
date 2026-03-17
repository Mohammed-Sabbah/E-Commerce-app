const jwt = require("jsonwebtoken");
const util = require("util");

let createToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED
    });
}

let verifyToken = function (token) {
    return util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
}

module.exports = {
    createToken,
    verifyToken
}