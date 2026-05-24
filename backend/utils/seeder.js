// =============================================================
//  seeder.js  –  بيجيب داتا حقيقية من DummyJSON ويحطها في MongoDB
//  الاستخدام:
//    node utils/seeder.js -d   ← حذف كل الداتا
//    node utils/seeder.js -i   ← إدخال الداتا
// =============================================================

const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// ─── helper ─────────────────────────────────────────────────
const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${url}`);
    return res.json();
};

// ─── models ──────────────────────────────────────────────────
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Coupon = require("../models/Coupon");

// ─── data ────────────────────────────────────────────────────
const CATEGORY_MAP = {
    "beauty": ["Beauty Skincare", "Beauty Makeup"],
    "fragrances": ["Fragrances Perfumes", "Fragrances Body Sprays"],
    "furniture": ["Furniture Living Room", "Furniture Bedroom"],
    "groceries": ["Groceries Fruits Vegetables", "Groceries Dairy"],
    "home-decoration": ["Home Wall Art", "Home Lighting"],
    "kitchen-accessories": ["Kitchen Cookware", "Kitchen Storage"],
    "laptops": ["Gaming Laptops", "Business Laptops"],
    "mens-shirts": ["Mens Casual Shirts", "Mens Formal Shirts"],
    "mens-shoes": ["Mens Sneakers", "Mens Boots"],
    "mens-watches": ["Mens Luxury Watches", "Mens Sport Watches"],
    "mobile-accessories": ["Mobile Cases", "Mobile Chargers"],
    "motorcycle": ["Motorcycle Parts", "Motorcycle Gear"],
    "skin-care": ["Skincare Face", "Skincare Body"],
    "smartphones": ["Android Phones", "iPhones"],
    "sports-accessories": ["Sports Gym", "Sports Outdoor"],
    "sunglasses": ["Men Sunglasses", "Women Sunglasses"],
    "tablets": ["Android Tablets", "iPads"],
    "tops-for-women": ["Women T-Shirts", "Women Blouses"],
    "vehicle": ["Vehicle Cars", "Vehicle SUVs"],
    "womens-bags": ["Womens Handbags", "Womens Backpacks"],
    "womens-dresses": ["Casual Dresses", "Evening Dresses"],
    "womens-jewellery": ["Jewellery Necklaces", "Jewellery Rings"],
    "womens-shoes": ["Womens Heels", "Womens Flats"],
    "womens-watches": ["Womens Luxury Watches", "Womens Sport Watches"],
};

const CATEGORY_PHOTOS = {
    "beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    "fragrances": "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",
    "furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    "groceries": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    "home-decoration": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    "kitchen-accessories": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "mens-shirts": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
    "mens-shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "mens-watches": "https://images.unsplash.com/photo-1523170335258-f4f3f4f2fd59?w=400",
    "mobile-accessories": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    "motorcycle": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "skin-care": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    "sports-accessories": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    "sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    "tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    "tops-for-women": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    "vehicle": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
    "womens-bags": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    "womens-dresses": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    "womens-jewellery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    "womens-shoes": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    "womens-watches": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400",
};

// ─── delete ──────────────────────────────────────────────────
const deleteAll = async () => {
    await Promise.all([
        Category.deleteMany({}),
        SubCategory.deleteMany({}),
        Brand.deleteMany({}),
        Product.deleteMany({}),
        User.deleteMany({}),
        Cart.deleteMany({}),
        Order.deleteMany({}),
        Review.deleteMany({}),
        Coupon.deleteMany({}),
    ]);
    console.log("🗑️  All data deleted");
};

// ─── seed ────────────────────────────────────────────────────
const seedAll = async () => {

    // 1. Categories
    console.log("\n📦 Seeding categories...");
    const categoryDocs = await Category.insertMany(
        Object.keys(CATEGORY_MAP).map((key) => ({
            name: key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
            slug: slug(key),
            photo: CATEGORY_PHOTOS[key] || "https://via.placeholder.com/400",
        }))
    );
    console.log(`   ✅ ${categoryDocs.length} categories`);

    const categoryBySlug = {};
    categoryDocs.forEach((c) => (categoryBySlug[c.slug] = c._id));

    // 2. SubCategories
    console.log("📦 Seeding subcategories...");
    const subCatData = [];
    Object.entries(CATEGORY_MAP).forEach(([catKey, subs]) => {
        const catId = categoryBySlug[slug(catKey)];
        subs.forEach((subName) => {
            subCatData.push({
                name: subName,
                slug: slug(subName),
                photo: "https://via.placeholder.com/400",
                category: catId,
            });
        });
    });
    const subCatDocs = await SubCategory.insertMany(subCatData);
    console.log(`   ✅ ${subCatDocs.length} subcategories`);

    const subsByCatId = {};
    subCatDocs.forEach((s) => {
        const key = s.category.toString();
        if (!subsByCatId[key]) subsByCatId[key] = [];
        subsByCatId[key].push(s._id);
    });

    // 3. Brands
    console.log("📦 Seeding brands...");
    const { products: allProducts } = await fetchJson(
        "https://dummyjson.com/products?limit=194&select=brand"
    );
    const uniqueBrands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
    const brandDocs = await Brand.insertMany(
        uniqueBrands.map((name) => ({
            name,
            slug: slug(name),
            photo: "https://via.placeholder.com/400",
        }))
    );
    console.log(`   ✅ ${brandDocs.length} brands`);

    const brandByName = {};
    brandDocs.forEach((b) => (brandByName[b.name] = b._id));


    
    // 4. Products
    console.log("📦 Seeding products...");
    const { products } = await fetchJson("https://dummyjson.com/products?limit=194");

    // ألوان أساسية
    const baseColors = ["black", "white", "red", "blue", "green", "yellow", "gray"];

    // function نظيفة بدون تخريب الـ array الأصلي
    const getRandomColors = () => {
        const shuffled = [...baseColors].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);

        // تأكد الأسود موجود
        if (!selected.includes("black")) {
            selected.push("black");
        }

        return selected;
    };

    const fallbackCatId = categoryDocs[0]._id;
    const fallbackSubIds = subsByCatId[fallbackCatId.toString()] || [];

    const productData = products.map((p) => {
        const catSlug = slug(p.category);
        const matchedCatId = categoryBySlug[catSlug];
        const catId = matchedCatId || fallbackCatId;
        const subCatIds = matchedCatId
            ? subsByCatId[catId.toString()] || []
            : fallbackSubIds;

        const brandId = brandByName[p.brand] || null;

        const description =
            p.description.length >= 20
                ? p.description
                : `${p.description} — ${p.title} is a high quality product.`;

        return {
            name: p.title,
            slug: slug(p.title),
            description,
            quantity: p.stock,
            sold: Math.floor(Math.random() * 50),
            price: p.price,
            priceAfterDiscount: p.discountPercentage
                ? parseFloat((p.price * (1 - p.discountPercentage / 100)).toFixed(2))
                : undefined,
            coverImage: p.thumbnail,
            images: p.images || [],
            category: catId,
            subCategory: subCatIds.slice(0, 1),
            brand: brandId,
            avgRatings: p.rating,
            ratingsQuantity: Math.floor(Math.random() * 200) + 10,

            colors: getRandomColors(), // 👈 الإضافة المهمة
        };
    });

    await Product.insertMany(productData);
    console.log(`   ✅ ${productData.length} products`);
    // 5. Users
    console.log("📦 Seeding users...");
    await User.create({
        name: "Admin",
        slug: "admin",
        email: "admin@ecommerce.com",
        password: bcrypt.hashSync("admin123", 10),
        phone: "0569999999",
        role: "admin",
        profileImage: "https://i.pravatar.cc/150?img=3",
        isActive: true,
    });

    const testUsers = Array.from({ length: 5 }, (_, i) => ({
        name: `Test User ${i + 1}`,
        slug: `test-user-${i + 1}`,
        email: `user${i + 1}`,
        password: bcrypt.hashSync("12345678", 10),
        phone: `056${String(i).padStart(7, "0")}`,
        role: "user",@ecommerce.com
        profileImage: `https://i.pravatar.cc/150?img=${i + 10}`,
        isActive: true,
    }));
    await User.insertMany(testUsers);
    console.log(`   ✅ 1 admin + 5 users`);

    console.log("\n🎉 Seeding completed!");
    console.log("─────────────────────────────────");
    console.log("   Admin:  admin@ecommerce.com  /  admin123");
    console.log("   User:   user1@ecommerce.com  /  12345678");
    console.log("─────────────────────────────────\n");
};

// ─── run ─────────────────────────────────────────────────────
const run = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("✅ DB connected");

        const mode = process.argv[2];

        if (!["-d", "-i"].includes(mode)) {
            console.error("❌ Please specify '-d' to delete or '-i' to insert.");
            process.exit(1);
        }

        if (mode === "-d") await deleteAll();
        if (mode === "-i") await seedAll();

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

run();