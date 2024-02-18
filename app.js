const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');


const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();

// Allow Cross-Origin requests
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204

  })
);

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15000kb'
}));

// restrict cross origin resource sharing only to the same origin
app.use((req, res, next) => {
    res.setHeader('cross-origin-resource-policy', 'same-site');
    next();
});

// expoes static files
app.use(express.static(`${__dirname}/public`));
// export static files react build
app.use(express.static(`${__dirname}/output`));

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());



// Routes
app.use('/api/users', userRoutes);
app.use('/api', portfolioRoutes);

// handle undefined api Routes
app.use('api/*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined api route');
    console.log(req.originalUrl);
    next(err, req, res, next);
});

// if the route does not start with /api, then it is a react route
app.use('/*', (req, res) => {
    res.sendFile(`${__dirname}/output/index.html`);
});


app.use(globalErrHandler);

module.exports = app;






