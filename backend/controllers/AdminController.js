const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { asyncErrorHandler } = require("../middlewares/ErrorMiddleware");

const getAdminStats = asyncErrorHandler(async (req, res) => {
    const results = await Promise.allSettled([
        Order.countDocuments(),
        Order.aggregate([
            { $match: { status: { $nin: ["cancelled", "returned"] } } },
            { $group: { _id: null, revenue: { $sum: "$totalOrderPrice" } } }
        ]),
        Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        User.countDocuments({ role: "user" }),
        Product.countDocuments(),
        Order.find()
            .sort("-createdAt")
            .limit(5)
            .populate({ path: "user", select: "name email" }),
        // Monthly revenue (last 12 months)
        Order.aggregate([
            { $match: { status: { $nin: ["cancelled", "returned"] } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: "$totalOrderPrice" },
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 12 }
        ]),
        // Monthly orders (last 12 months)
        Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 12 }
        ]),
        // Top 10 products by quantity sold
        Order.aggregate([
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: "$cartItems.product",
                    name: { $first: "$cartItems.product" },
                    quantity: { $sum: "$cartItems.quantity" },
                    revenue: { $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] } },
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ["$product.name", "Deleted Product"] },
                    quantity: 1,
                    revenue: 1,
                }
            }
        ]),
    ]);

    const get = (index, fallback = null) =>
        results[index]?.status === "fulfilled" ? results[index].value : fallback;

    res.status(200).json({
        status: "success",
        data: {
            totalOrders: get(0, 0),
            totalRevenue: get(1, [])[0]?.revenue ?? 0,
            ordersByStatus: get(2, []),
            totalUsers: get(3, 0),
            totalProducts: get(4, 0),
            recentOrders: get(5, []),
            monthlyRevenue: get(6, []),
            monthlyOrders: get(7, []),
            topProducts: get(8, []),
        }
    });
});

module.exports = { getAdminStats };
