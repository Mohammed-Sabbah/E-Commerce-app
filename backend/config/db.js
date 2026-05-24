const mongoose = require("mongoose");

let connectDb = function (uri) {
    mongoose.connect(uri)
        .then(conn => console.log(`Db connected on: ${conn.connection.host}`))
        .catch(err => {
            console.error(`Db error: ${err}`);
            process.exit(1);
        });
}

module.exports = { connectDb };