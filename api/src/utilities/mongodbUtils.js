const mongoose = require('mongoose');

const { env: { MONGO_DB_URI } } = process;

const connectDB = () => {
  mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('MongoDB is connected'))
    .catch(() => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      setTimeout(connectDB, 5000);
    });
};

const closeDB = () => {
  mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
