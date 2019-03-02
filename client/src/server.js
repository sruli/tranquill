const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { OK, MOVED_PERMANENTLY } = require('http-status');

const app = express();

app.set('trust proxy', true);

app.use(helmet.hsts({ maxAge: 31536000, preload: true, setIf: req => req.secure }));

app.use(morgan('combined'));

// For Kubernetes health check
app.get('/healthy', (req, res) => {
  res.status(OK).end();
});

app.use((req, res, next) => {
  if (req.protocol === 'http') {
    const host = process.env.CLIENT_HOST || 'tranquillapp.com';
    return res.redirect(MOVED_PERMANENTLY, `https://${host}${req.originalUrl}`);
  }
  return next();
});

app.use(express.static(path.join(__dirname, '../build')));

app.use((req, res) => {
  res.status(OK).sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(process.env.CLIENT_PORT || 3000);

module.exports = app;
