
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const { verifyToken } = require("../utils/JWTs");
const { asyncErrorHandler } = require("./ErrorMiddleware");

const protect = asyncErrorHandler(async function (req, res, next) {
    // check if token is exist
    let token;
    let authHeder = req.headers.Authorization || req.headers.authorization;
    let authCookie = req.headers.cookie;
    
    if (authCookie && authCookie.startsWith("token=")) {
        token = authCookie.split("token=")[1];
        if (token.includes(";")) {
            token = token.split(";")[0];
        }
    }
    
    if ((req.cookies && req.cookies.token)) 
        ({token} = req.cookies);
    
    if (authHeder && authHeder.startsWith("Bearer"))
        token = authHeder.split(" ")[1];
    
    if (!token)
        throw new CustomError("Invalid or no token sent, please login!", 401);

    // verify token
    let decoded = await verifyToken(token);

    // find the user with the id in the token
    let user = await User.findById(decoded.id);
    if (!user)
        throw new CustomError("There is no user with the id provided in the token", 404);

    // check if user change his password after creating the token
    if (user.passwordChangedAt) {
        let passwordChangedAtInMS = (new Date(user.passwordChangedAt)).getTime();
        if (passwordChangedAtInMS > (decoded.iat * 1000))
            throw new CustomError("You have changed yor password after token was created, please login again", 401);
    }

    req.user = user;

    next();
})

const allowedTo = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role))
            throw new CustomError("You are not authorized to preform this action", 403);

        next();
    }
}

module.exports = {
    protect,
    allowedTo
}