const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiChange = require('chai-change');
const sinonChai = require('sinon-chai');
const FactoryGirl = require('factory-girl');
const { connectDB, closeDB } = require('../src/utilities/mongodbUtils');
const Notebook = require('../src/models/notebook');
const ContentBlock = require('../src/models/contentBlock');

const { factory } = FactoryGirl;
const adapter = new FactoryGirl.MongooseAdapter();

chai.use(chaiAsPromised);
chai.use(chaiChange);
chai.use(sinonChai);

factory.setAdapter(adapter);

before(async () => {
  connectDB();
  await Promise.all([Notebook, ContentBlock].map(async (model) => {
    await model.deleteMany();
  }));
});

after(() => {
  closeDB();
});

afterEach(async () => {
  await factory.cleanUp();
});
