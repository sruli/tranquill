const mongoose = require('mongoose');

const { env: { MONGO_DB_URI } } = process;

const NOISY = process.env.NODE_ENV === 'development';

const connectDB = () => {
  const { readyState } = mongoose.connection;
  const { disconnected } = mongoose.Connection.STATES;

  if (readyState !== disconnected) return;

  mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => NOISY && console.log('MongoDB is connected'))
    .catch(() => {
      if (NOISY) console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
      setTimeout(connectDB, 5000);
    });
};

const closeDB = () => {
  const { readyState } = mongoose.connection;
  const { connected } = mongoose.Connection.STATES;

  if (readyState !== connected) return;

  mongoose.connection.close();
};

const dropDB = () => {
  if (mongoose.connection.db) {
    mongoose.connection.db.dropDatabase().catch(() => {});
  }
};

module.exports = { connectDB, closeDB, dropDB };
