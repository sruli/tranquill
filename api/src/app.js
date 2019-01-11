const express = require('express');
const { connectDB } = require('./utilities/mongodbUtils');
const routes = require('./routes');

connectDB();

const app = express();

app.use(routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.APP_SERVER_PORT);
}
module.exports = app;
