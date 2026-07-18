const mongoose = require("mongoose");

// Cached connection for serverless environments
// Re-uses existing connection across warm invocations instead of reconnecting every request
let cachedConnection = null;

async function connectDb(uri) {
    // Return cached connection if already connected
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        cachedConnection = await mongoose.connect(uri, {
            bufferCommands: false,
        });
        console.log(`Db connected on: ${cachedConnection.connection.host}`);
        return cachedConnection;
    } catch (err) {
        console.error(`Db connection error: ${err}`);
        cachedConnection = null;
        // Throw instead of process.exit(1) — let the error propagate to the caller
        throw err;
    }
}

module.exports = { connectDb };