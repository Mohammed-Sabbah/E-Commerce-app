let addUserIdToReqBody = function (req, res, next) {
    req.body.user = req.user.id;
    next();
}

let addProductIdToReqBody = function (req, res, next) {
    if (req.params.productId)
        req.body.product = req.params.productId;
    next();
}

let addProductIdToFilterObj = function (req, res, next) {
    if (req.params.productId)
        req.filterObj = { product: req.params.productId };
    next();
}

module.exports = {
    addUserIdToReqBody,
    addProductIdToReqBody,
    addProductIdToFilterObj
}