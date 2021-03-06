const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Notebook = require('./Notebook');
const { SALT_ROUNDS } = require('../../config/bcrypt');

// eslint-disable-next-line no-useless-escape
const emailRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const modelName = 'User';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, match: emailRegex, index: true, trim: true },
  password: { type: String, minlength: 8, maxlength: 72 },
  firstName: String,
}, {
  timestamps: true,
});

userSchema.path('email').validate({
  validator: async function validateEmailUniqueness(email) {
    const existing = await this.model(modelName).findOne({ email });
    if (!existing) return true;
    if (existing.id === this.id) return true;
    return false;
  },
  message: 'Email has already been taken.',
});

userSchema.pre('save', async function encryptPassword(done) {
  if (!this.isModified('password')) return done();

  const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hash;
  return done();
});

class UserClass {
  static async findByEmailAndPassword({ email, password }) {
    const user = await this.findOne({ email });
    if (!user) return null;
    const correct = await bcrypt.compare(password, user.password);
    if (correct) return user;
    return null;
  }

  async correctPassword(password) {
    const correct = await bcrypt.compare(password, this.password);
    return correct;
  }

  notebooksQuery({ options } = {}) {
    const sort = (options && options.sort) || { createdAt: 'asc' };
    return Notebook.find({ user: this }).sort(sort);
  }
}

userSchema.loadClass(UserClass);

const User = mongoose.model(modelName, userSchema);

module.exports = User;
