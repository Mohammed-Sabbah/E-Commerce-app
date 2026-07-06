require("dotenv").config({ path: require("path").join(__dirname, "../../config/.env") });
const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error("DB_URL is not defined in config/.env");
  process.exit(1);
}

const models = ["Product", "Category", "Brand", "SubCategory"];

async function migrate() {
  await mongoose.connect(dbUrl);
  console.log(`Connected to MongoDB: ${dbUrl}`);

  for (const modelName of models) {
    const Model = mongoose.model(modelName, new mongoose.Schema({}, { strict: false }), modelName.toLowerCase() + "s");
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
