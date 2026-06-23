const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { getAdminStats } = require("../controllers/AdminController");

const router = express.Router();

router.use(protect, allowedTo("admin"));

router.get("/stats", getAdminStats);

module.exports = router;
