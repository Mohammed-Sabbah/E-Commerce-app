const { default: slugify } = require("slugify");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const QueryManipulater = require("../utils/QueryManipulater");
const CustomError = require("../utils/CustomError");


let getAll = function (model) {
    return asyncErrorHandler(async function (req, res) {

        let qm = new QueryManipulater(req, model)
            .filter()
            .discountFilter()
            .limit()
            .sort()
            .search()

        if (req.filterObj) {
            qm.query = qm.query.find(req.filterObj);
        }

        let totalCount = await qm.query.clone().countDocuments();

        qm.paginate();

        let docs = await qm.query;

        res.status(200).json({
            status: "success",
            count: docs.length,
            totalCount,
            data: {
                docs
            }
        });
    });
}

let createOne = function (model) {
    return asyncErrorHandler(async function (req, res) {
        if (req.body.name)
            req.body.slug = slugify(req.body.name);

        let newDoc = await model.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                newDoc
            }
        });
    });
}

let getOne = function (model, modelName = "", populateOption = "") {
    return asyncErrorHandler(async function (req, res) {
        let query = model.findById(req.params.id);

        if (populateOption)
            query.populate(populateOption);

        let doc = await query;

        if (!doc)
            throw new CustomError(`There is no ${modelName} with id : ${req.params.id}`, 404);
        res.status(200).json({
            status: "success",
            data: {
                doc
            }
        });
    });
}

let updateOne = function (model, modelName) {
    return asyncErrorHandler(async function (req, res) {
        if (req.body.name)
            req.body.slug = slugify(req.body.name);

        let updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body,
            {
                runValidators: true,
                new: true
            }
        );

        if (!updatedDoc)
            throw new CustomError(`There is no ${modelName} with id : ${req.params.id}`, 404);

        updatedDoc.save();

        res.status(200).json({
            status: "success",
            data: {
                updatedDoc
            }
        });
    });
}

let deleteOne = function (model, modelName = "") {
    return asyncErrorHandler(async function (req, res) {
        // ✅ إصلاح: findOneAndDelete(string) دايماً ترجع null — لازم findByIdAndDelete
        let deletedDoc = await model.findByIdAndDelete(req.params.id);

        if (!deletedDoc)
            throw new CustomError(`There is no ${modelName} with id: ${req.params.id}`, 404);

        res.status(204).send();

    });
};


module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
}
