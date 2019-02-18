const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utilities/mongodbUtils');
const routes = require('./routes');
const morganConfig = require('../config/morgan');

connectDB();

const app = express();

app.use(morgan(...morganConfig));
app.use(cookieParser());

app.use(routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.APP_SERVER_PORT);
}
module.exports = app;
