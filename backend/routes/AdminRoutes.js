const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { getAdminStats } = require("../controllers/AdminController");
const Product = require("../models/Product");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const router = express.Router();

router.use(protect, allowedTo("admin"));

router.get("/stats", getAdminStats);

router.patch("/products/:id/remove-cover", asyncErrorHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { coverImage: null },
        { new: true }
    );
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json({ status: "success", data: { doc: product } });
}));

module.exports = router;
