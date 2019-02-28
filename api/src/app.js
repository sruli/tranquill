const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utilities/mongodbUtils');
const routes = require('./routes');
const morganConfig = require('../config/morgan');
const corsConfig = require('../config/cors');

connectDB();

const app = express();

app.use(cors(corsConfig));
app.use(morgan(...morganConfig));
app.use(cookieParser());

app.use(routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.API_PORT);
}
module.exports = app;
