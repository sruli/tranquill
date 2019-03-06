const mongoose = require('mongoose');

const { MONGO_DB_URL, MONGO_DB_NAME } = process.env;

const wait = function wait() {
  return new Promise(resolve => setTimeout(resolve, 5000));
};

const connectDB = async function connectDB() {
  async function connect() {
    try {
      await mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useCreateIndex: true });
      console.log('MongoDB is connected');
    } catch (e) {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
      await wait();
      await connect();
    }
  }

  console.log('MONGO_DB_NAME:', MONGO_DB_NAME);
  console.log('MONGO_DB_URL:', MONGO_DB_URL);
  const existing = mongoose.connections.find(({ name }) => name === MONGO_DB_NAME);
  if (!existing || existing.readyState === mongoose.Connection.STATES.disconnected) {
    await connect();
  }
};

const closeDB = function closeDB() {
  const { readyState } = mongoose.connection;
  const { connected } = mongoose.Connection.STATES;

  if (readyState !== connected) return;

  mongoose.connection.close();
};

const dropDB = function dropDB() {
  if (mongoose.connection.db) {
    mongoose.connection.db.dropDatabase().catch(() => {});
  }
};

module.exports = { connectDB, closeDB, dropDB };
