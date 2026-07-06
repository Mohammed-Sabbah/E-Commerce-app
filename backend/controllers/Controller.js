const { default: slugify } = require("slugify");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");
const QueryManipulater = require("../utils/QueryManipulater");
const CustomError = require("../utils/CustomError");
const { localizeDocs } = require("../utils/localizeField");

function getSlug(name) {
  if (name && typeof name === "object" && name.en) return slugify(name.en);
  return slugify(name);
}

let getAll = function (model) {
    return asyncErrorHandler(async function (req, res) {
        const lang = req.query.lang || "en";

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
        docs = docs.map((d) => (typeof d.toObject === "function" ? d.toObject({ virtuals: true }) : d));
        docs = localizeDocs(docs, lang);

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
        const lang = req.query.lang || "en";

        if (req.body.name)
            req.body.slug = getSlug(req.body.name);

        let newDoc = await model.create(req.body);
        newDoc = newDoc.toObject({ virtuals: true });
        newDoc = localizeDocs(newDoc, lang);

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
        const lang = req.query.lang || "en";

        let query = model.findById(req.params.id);

        if (populateOption)
            query.populate(populateOption);

        let doc = await query;

        if (!doc)
            throw new CustomError(`There is no ${modelName} with id : ${req.params.id}`, 404);

        doc = doc.toObject({ virtuals: true });
        doc = localizeDocs(doc, lang);

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
        const lang = req.query.lang || "en";

        if (req.body.name)
            req.body.slug = getSlug(req.body.name);

        let updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body,
            {
                runValidators: true,
                new: true
            }
        );

        if (!updatedDoc)
            throw new CustomError(`There is no ${modelName} with id : ${req.params.id}`, 404);

        updatedDoc = updatedDoc.toObject({ virtuals: true });
        updatedDoc = localizeDocs(updatedDoc, lang);

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
