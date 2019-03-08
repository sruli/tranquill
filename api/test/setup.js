const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiChange = require('chai-change');
const sinonChai = require('sinon-chai');
const FactoryGirl = require('factory-girl');
const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const redisClient = require('../config/redis');
const { connectDB, closeDB } = require('../src/utilities/mongodbUtils');
const Notebook = require('../src/models/Notebook');
const ContentBlock = require('../src/models/ContentBlock');
const User = require('../src/models/User');

const { factory } = FactoryGirl;
const adapter = new FactoryGirl.MongooseAdapter();

chai.use(chaiAsPromised);
chai.use(chaiChange);
chai.use(sinonChai);

factory.setAdapter(adapter);

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

before(async () => {
  await connectDB();
  await Promise.all([Notebook, ContentBlock, User].map(async (model) => {
    await model.deleteMany();
  }));
});

after(() => {
  closeDB();
});

afterEach(async () => {
  await factory.cleanUp();
});

beforeEach(async () => {
  await redisClient.flushdbAsync();
});

after(async () => {
  await redisClient.quitAsync();
});
