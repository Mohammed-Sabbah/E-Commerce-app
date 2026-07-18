const express = require("express");
const morgan = require("morgan");
const passport = require('passport');
const cors = require('cors');
const expressLimit = require("express-rate-limit");
const hpp = require('hpp');
const helmet = require("helmet");
const sanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require('cookie-parser');

// import strategy
const strategies = require('./config/passport');

// import routes
const routes = require("./routes");

// import globalErrorHandler
const { globalErrorHandler } = require("./middlewares/ErrorMiddleware");
const CustomError = require("./utils/CustomError");

let app = express();

app.set('trust proxy', 1);

app.use(cookieParser());


// Health check
app.get('/healthz', (req, res) => res.send('OK'));


// use strategies
passport.use(strategies.googleStrategy);
passport.use(strategies.facebookStrategy);

//webhook route — raw body لازم يجي قبل express.json
const { webhook } = require("./controllers/PaymentController");
app.post("/api/v1/webhook", express.raw({ type: "application/json" }), webhook);

// rate limiter
const authLimiter = expressLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later."
});

// middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            imgSrc: ["'self'", "data:", "http://localhost:8000"],
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));


app.use(hpp());
app.use(sanitizer());
app.use(xss());


app.use("/api/v1/auth", authLimiter);

app.use(passport.initialize());

// routes
routes(app);

app.use(globalErrorHandler);

module.exports = app;