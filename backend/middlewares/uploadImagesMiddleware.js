const multer = require("multer");
const CustomError = require("../utils/CustomError");

let upload = function () {
    // diskStorage config
    /* const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/categories");
        },
        filename: function (req, file, cb) {
            let extension = file.mimetype.split("/")[1];
            let unique = crypto.randomBytes(6).toString("hex");
            let fileName = `category-${unique}-${Date.now()}.${extension}`;
            cb(null, fileName);
        }
    }); */
    let storage = multer.memoryStorage();

    let fileFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image'))
            cb(null, true);
        else
            cb(CustomError("Only images is accepted", 400), false);
    }

    return multer({ storage, fileFilter });
}

let uploadSingleImage = (fieldName) => upload().single(fieldName);

let uploadMultipleImages = (fieldsName) => upload().fields(fieldsName);

module.exports = {
    uploadSingleImage,
    uploadMultipleImages
}