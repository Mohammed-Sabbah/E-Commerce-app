const app = require("../app");
const { connectDb } = require("../config/db");

// Module-level promise — reused across warm invocations in the same container
let dbConnectionPromise;

/**
 * Vercel Serverless Function handler.
 * Wraps the Express app so it can run as a serverless function.
 * Ensures MongoDB is connected before handling each request.
 */
module.exports = async (req, res) => {
    // Initiate DB connection once per container lifecycle (cached for warm starts)
    if (!dbConnectionPromise) {
        dbConnectionPromise = connectDb(process.env.DB_URI);
    }
    await dbConnectionPromise;
    return app(req, res);
};
