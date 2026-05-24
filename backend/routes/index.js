const CategoriesRoutes = require("./CategoriesRoutes");
const SubCategoriesRoutes = require("./SubCategoriesRoutes");
const brandsRoutes = require("./BrandsRoutes");
const productRoutes = require("./ProductRoutes");
const userRoutes = require("./UserRoutes");
const authRoutes = require("./AuthRouts");
const reviewsRoutes = require("./ReviewRoutes");
const wishlistRoutes = require("./WishlistRouts");
const addressesRoutes = require("./AddressRouts");
const CouponRout = require("./CouponRoutes");
const CartRout = require("./CartRouts");
const OrderRout = require("./OrderRouts");
const PaymentRout = require("./PaymentRoutes");
const DefaultRoute = require("./DefaultRoute");

module.exports = (app) => {
    app.use("/api/v1/categories", CategoriesRoutes);
    app.use("/api/v1/subCategories", SubCategoriesRoutes);
    app.use("/api/v1/brands", brandsRoutes);
    app.use("/api/v1/products", productRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/reviews", reviewsRoutes);
    app.use("/api/v1/wishlist", wishlistRoutes);
    app.use("/api/v1/addresses", addressesRoutes);
    app.use("/api/v1/coupons", CouponRout);
    app.use("/api/v1/cart", CartRout);
    app.use("/api/v1/orders", OrderRout);
    app.use("/api/v1/payment", PaymentRout);

    // default route
    app.use(DefaultRoute)
}