const express = require('express');

const morgan = require('morgan');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');

const globalErorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const userRoute = require('./routes/user.routes');
const ideaRoutes = require('./routes/idea.routes');
const universityRoutes = require('./routes/university.routes');
const proposalRoutes = require('./routes/proposal.routes');

const app = express();

// API Security and Perforance
/*
// Code for API Whitelist

{
    origin: 'https://clever-bone.surge.sh',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

*/

app.use(
  cors({
    origin: 'http://dapper-top.surge.sh',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(helmet());

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limiting the Data
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security from Query Injection & Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Data compression
app.use(compression());

app.use(express.static(`${__dirname}/public`));

// API Routes
app.use('/v1/api/idea', ideaRoutes);
app.use('/v1/api/user', userRoute);
app.use('/v1/api/university', universityRoutes);
app.use('/v1/api/proposal', proposalRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError("Can't find this Endpoint on the Server!", 404));
});

app.use(globalErorHandler);

module.exports = app;
