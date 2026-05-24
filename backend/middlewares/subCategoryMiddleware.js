let addCategoryIdToReqBody = function (req, res, next) {
    if (req.params.categoryId)
        req.body.category = req.params.categoryId;
    next()
}

let addFilterToReqBody = function name(req, res, next) {
    req.filterObj = {};
    if (req.params.categoryId)
        req.filterObj.category = req.params.categoryId;
    next();
}

module.exports = {
    addCategoryIdToReqBody,
    addFilterToReqBody
}