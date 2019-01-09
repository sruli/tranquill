const express = require('express');
const { connectDB } = require('./utilities/mongodbUtils');

const app = express();

connectDB();

app.listen(process.env.APP_SERVER_PORT);
