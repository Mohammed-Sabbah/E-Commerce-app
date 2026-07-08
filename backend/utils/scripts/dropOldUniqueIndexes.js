require("dotenv").config({ path: require("path").join(__dirname, "../../config.env") });
const mongoose = require("mongoose");

async function run() {
    await mongoose.connect(process.env.DB_URI);
    const collections = ["categories", "brands", "subcategories"];
    for (const col of collections) {
        try {
            await mongoose.connection.db.collection(col).dropIndex("name.ar_1");
            console.log(`${col}: dropped index name.ar_1`);
        } catch (err) {
            console.log(`${col}: ${err.message}`);
        }
    }
    await mongoose.disconnect();
}
run();