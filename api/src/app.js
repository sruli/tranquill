const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { OK } = require('http-status');
const { connectDB } = require('./utilities/mongodbUtils');
const routes = require('./routes');
const morganConfig = require('../config/morgan');
const corsConfig = require('../config/cors');
const enforceSSL = require('./middlewares/enforceSSL');

connectDB();

const app = express();

app.set('trust proxy', true);

// For Kubernetes health check
app.get('/healthy', (req, res) => {
  res.status(OK).end();
});

app.use(enforceSSL);
app.use(cors(corsConfig));
app.use(morgan(...morganConfig));
app.use(cookieParser());

app.use(routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.API_PORT);
}
module.exports = app;
