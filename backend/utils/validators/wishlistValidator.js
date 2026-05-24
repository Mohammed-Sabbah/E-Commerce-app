const validator = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

const wishlistValidator = [
    validator.check("productId")
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("invalid product id format"),
    validationMiddleware
]

module.exports = {
    wishlistValidator
}