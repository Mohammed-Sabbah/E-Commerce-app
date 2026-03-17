const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (error) => {
    console.log(`UncaughtException: ${error.name} : ${error.message}, ${error.stack}`);
    console.log(`Shutting down...`);
    process.exit(1);
});

let app = require("./app");

let port = process.env.PORT || 8000;
let host = process.env.HOST || "localhost";
let env = process.env.NODE_ENV || "development";

let server = app.listen(port, () => {
    console.log(`Mode => ${env}`);
    console.log(`Server started at http://${host}:${port}`);
});

db.connectDb(process.env.DB_URI);

process.on("unhandledRejection", (error) => {
    console.log(`UnhandledRejection: ${error.name} : ${error.message}, ${error.stack}`);
    server.close(() => {
        console.log(`Shutting down...`);
        process.exit(1);
    });
});
module.exports = server;