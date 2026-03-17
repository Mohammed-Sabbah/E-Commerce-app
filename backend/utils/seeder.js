// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { connectDb } = require('../config/db');

const Brand = require('../models/Brand');
const Cart = require('../models/Cart');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const SubCategory = require('../models/SubCategory');
const User = require('../models/User');

dotenv.config({ path: '../config.env' });

const deleteAllData = async () => {
    await Brand.deleteMany({});
    await Cart.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await SubCategory.deleteMany({});
    await User.deleteMany({});
    console.log(`All data deleted.`);
};

const seedAdmin = async () => {
    await User.create({
        name: 'Admin',
        email: 'admin@ecommerse.com',
        password: 'admin123',
        phone: faker.helpers.fromRegExp("05[6-7][0-9]{3}[0-9]{4}"),
        role: 'admin',
        profileImage: faker.image.avatar(),
    });
    console.log("Admin created.");
};

const seedUsers = async (count = 20) => {
    const users = [];
    for (let i = 0; i < count; i += 1) {
        faker.seed(i + Math.round(Math.random() * 100000));
        const gender = faker.helpers.arrayElement(['male', 'female']);
        const firstName = faker.person.firstName({ sex: gender });
        const lastName = faker.person.lastName({ sex: gender });
        users.push({
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({
                firstName,
                lastName
            }),
            password: '12345678',
            phone: faker.helpers.fromRegExp("05[6-7][0-9]{3}[0-9]{4}"),
            profileImage: faker.image.avatar(),
            role: 'user',
            isActive: true
        });
    }

    await User.create(users);
    console.log(`${count} users created.`);
};

const seedCategories = async (count = 5) => {
    const categories = [];

    for (let i = 0; i < count; i += 1) {
        faker.seed(i + Math.round(Math.random() * 100000));
        const name = faker.commerce.department();
        categories.push({
            name,
            slug: faker.helpers.slugify(name),
            photo: faker.image.url(),
        });
    }

    const createdCategories = await Category.create(categories);
    console.log(`${count} categories created.`);
    return createdCategories;
};

const seedSubCategories = async (categories, countPerCategory = 2) => {
    const subCategories = [];

    categories.forEach(category => {
        for (let i = 0; i < countPerCategory; i += 1) {
            faker.seed(i + Math.round(Math.random() * 100000));
            const name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}`;
            subCategories.push({
                name,
                slug: faker.helpers.slugify(name),
                photo: faker.image.url(),
                category: category._id,
            });
        }
    });

    const createdSubCategories = await SubCategory.create(subCategories);
    console.log(`${subCategories.length} subcategories created.`);
    return createdSubCategories;
};

const seedBrands = async (count = 5) => {
    const brands = [];

    for (let i = 0; i < count; i += 1) {
        faker.seed(i + Math.round(Math.random() * 100000));
        const name = faker.company.name();
        brands.push({
            name,
            slug: faker.helpers.slugify(name),
            photo: faker.image.url(),
        });
    }

    const createdBrands = await Brand.create(brands);
    console.log(`${count} brands created.`);
    return createdBrands;
};

const seedProducts = async ({ categories, subCategories, brands }, count = 20) => {
    const products = [];

    for (let i = 0; i < count; i += 1) {
        faker.seed(i + Math.round(Math.random() * 100000));
        const category = faker.helpers.arrayElement(categories);
        const relatedSubCategories = subCategories.filter(sc => sc.category.toString() === category._id.toString());
        const subCategory = faker.helpers.arrayElement(relatedSubCategories);
        const brand = faker.helpers.arrayElement(brands);

        const name = faker.commerce.productName();

        products.push({
            name,
            slug: faker.helpers.slugify(name),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({ min: 10, max: 100 }),
            quantity: faker.number.int({ min: 1, max: 100 }),
            sold: faker.number.int({ min: 0, max: 20 }),
            coverImage: faker.image.url(),
            category: category._id,
            subCategories: [subCategory._id],
            brand: brand._id,
        });
    }

    await Product.create(products);
    console.log(`${count} products created.`);
};

(async () => {
    try {
        await connectDb(process.env.DB_URI);

        const mode = process.argv[2];

        if (!['-d', '-i'].includes(mode)) {
            console.error("Please specify '-d' to delete or '-i' to insert.");
            process.exit(1);
        }

        if (mode === '-d') {
            await deleteAllData();
            process.exit(0);
        }

        if (mode === '-i') {
            await seedAdmin();
            await seedUsers(20);
            const categories = await seedCategories(5);
            const subCategories = await seedSubCategories(categories, 2);
            const brands = await seedBrands(5);
            await seedProducts({ categories, subCategories, brands }, 20);
            console.log("Seeding completed. You can now login and test the platform.");
            process.exit(0);
        }
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
})();
