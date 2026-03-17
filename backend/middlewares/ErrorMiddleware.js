const CustomError = require("../utils/CustomError");


let devErrors = function (res, error) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error
    });
}

let prodErrors = function (res, error) {
    if (error.isOperational)
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    else
        res.status(500).json({
            status: "error",
            message: "Some thing is wrong"
        });
}

let duplicateKeyError = error => {
    let field = Object.keys(error.keyValue)[0];
    let value = error.keyValue[field];

    return new CustomError(`There is already document with the ${field}: ${value}`, 400);
}

let ValidationError = error => {
    const errors = Object.values(error.errors).map(el => el.message);

    return new CustomError(`Validation failed: ${errors.join(", ")}`, 400);
}

let CastError = error => new CustomError(`Invalid ${error.path}: ${error.value}`, 400);

let JsonWebTokenError = () => new CustomError(`Invalid token`, 400);


let asyncErrorHandler = function (asyncFn) {
    return (req, res, next) => {
        asyncFn(req, res, next).catch(error => next(error));
    }
}

let globalErrorHandler = function (error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV === "development")
        devErrors(res, error);

    if (process.env.NODE_ENV === "production") {
        if (error.code === 11000) error = duplicateKeyError(error);
        if (error.name === "ValidationError") error = ValidationError(error);
        if (error.name === "CastError") CastError(error);
        if (error.name === "JsonWebTokenError") JsonWebTokenError(error);

        prodErrors(res, error);
    }

}

module.exports = {
    asyncErrorHandler,
    globalErrorHandler
};