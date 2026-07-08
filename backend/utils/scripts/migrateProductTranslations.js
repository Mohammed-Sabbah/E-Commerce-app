require("dotenv").config({ path: require("path").join(__dirname, "../../config.env") });
const mongoose = require("mongoose");

const dbUrl = process.env.DB_URI;
if (!dbUrl) {
  console.error("DB_URL is not defined in config/.env");
  process.exit(1);
}

const models = [
  { name: "Product", collection: "products" },
  { name: "Category", collection: "categories" },
  { name: "Brand", collection: "brands" },
  { name: "SubCategory", collection: "subcategories" },
];

async function migrate() {
  await mongoose.connect(dbUrl);
  console.log(`Connected to MongoDB: ${dbUrl}`);

  for (const { name: modelName, collection } of models) {
    const Model = mongoose.model(modelName + "_migrate", new mongoose.Schema({}, { strict: false }), collection);
    const docs = await Model.find({});
    let updated = 0;

    for (const doc of docs) {
      let changed = false;

      if (doc.name && typeof doc.name === "string") {
        doc.name = { en: doc.name, ar: "" };
        changed = true;
      }

      if (doc.description && typeof doc.description === "string") {
        doc.description = { en: doc.description, ar: "" };
        changed = true;
      }

      if (changed) {
        await Model.updateOne({ _id: doc._id }, { $set: { name: doc.name, description: doc.description } });
        updated++;
      }
    }

    console.log(`${modelName}: ${updated} / ${docs.length} documents updated`);
  }

  await mongoose.disconnect();
  console.log("Migration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
