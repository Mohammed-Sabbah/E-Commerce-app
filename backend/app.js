const express = require("express");
const morgan = require("morgan");
const passport = require('passport');
const cors = require('cors');
const toobusy = require('toobusy-js');
const expressLimit = require("express-rate-limit");
const hpp = require('hpp');
const helmet = require("helmet");
const sanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");

// import strategy
const strategies = require('./config/passport');

// import routes
const routes = require("./routes");

// import globalErrorHandler
const { globalErrorHandler } = require("./middlewares/ErrorMiddleware");
const CustomError = require("./utils/CustomError");

let app = express();

// use strategies
passport.use(strategies.googleStrategy);
passport.use(strategies.facebookStrategy);

//webhook route
const { webhook } = require("./controllers/PaymentController");
app.post("/api/v1/webhook", express.raw({ type: "application/json" }), webhook);

// rate limiter
const authLimiter = expressLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

// middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));

app.use(function (req, res, next) {
    if (toobusy()) throw new CustomError("Server Too Busy", 503);
    else next();
});

app.use(hpp());
app.use(sanitizer());
app.use(xss());
app.use(express.static("uploads"));

app.use("/api/v1/auth", authLimiter);

app.use(passport.initialize());

// routes
routes(app);

app.use(globalErrorHandler);

module.exports = app;