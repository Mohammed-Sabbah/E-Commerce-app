const multer = require("multer");
const { createStorage } = require("../config/cloudinary");
const CustomError = require("../utils/CustomError");

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new CustomError("Only images are accepted", 400), false);
};

const uploadSingleImage = (fieldName, folder) => {
    const storage = createStorage(folder);
    return multer({ storage, fileFilter }).single(fieldName);
};

const uploadMultipleImages = (fields, folder) => {
    const storage = createStorage(folder);
    return multer({ storage, fileFilter }).fields(fields);
};

module.exports = { uploadSingleImage, uploadMultipleImages };
