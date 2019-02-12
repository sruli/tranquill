const mongoose = require('mongoose');
const { expect } = require('chai');
const moment = require('moment');
const User = require('../../src/models/User');
const userFactory = require('../factories/userFactory');
const notebookFactory = require('../factories/notebookFactory');

describe('User', () => {
  describe('email validation', () => {
    it('requires an email', () => {
      const noEmail = async () => {
        await userFactory.create('user', { email: null });
      };

      expect(noEmail()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Path `email` is required.',
      );
    });

    it('requires a valid email address', () => {
      const invalidEmail = async () => {
        await userFactory.create('user', { email: 'not an email' });
      };

      expect(invalidEmail()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Path `email` is invalid (not an email).',
      );
    });

    it('enforces email uniqueness', async () => {
      await userFactory.create('user', { email: 'duplicate@example.com' });
      const duplicate = async () => {
        await userFactory.create('user', { email: 'duplicate@example.com' });
      };

      expect(duplicate()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Email has already been taken.',
      );
    });

    it('does not raise a validation exception when updating existing user', async () => {
      const user = await userFactory.create('user', { email: 'user@example.com' });
      user.firstName = 'updated';
      expect(user.save()).to.not.be.rejectedWith(mongoose.Error.ValidationError);
    });
  });

  describe('password validation', () => {
    it('must be at least 8 characters', () => {
      const tooShort = async () => {
        await userFactory.create('user', { password: 'foo' });
      };
      expect(tooShort()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Path `password` (`foo`) is shorter than the minimum allowed length (8).',
      );
    });

    it('must be no more than 72 characters', () => {
      const password = 'a'.repeat(73);
      const tooLong = async () => {
        await userFactory.create('user', { password });
      };
      expect(tooLong()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'is longer than the maximum allowed length (72).',
      );
    });
  });

  it('encrypts passwords', async () => {
    const user = await userFactory.create('user', { password: 'password123' });
    expect(user.password).not.to.equal('password123');
  });

  describe('.findByEmailAndPassword', () => {
    context('when user exists with email and password', () => {
      it('finds the user', async () => {
        const user = await userFactory.create('user', { password: 'myawesomepassword' });
        const { email } = user;
        const found = await User.findByEmailAndPassword({ email, password: 'myawesomepassword' });
        expect(found.toObject()).to.deep.equal(user.toObject());
      });
    });

    context('when no users exists with email', () => {
      it('returns null', async () => {
        const found = await User.findByEmailAndPassword({ email: 'doesnt@exist.com' });
        expect(found).to.be.null;
      });
    });

    context('when password does not match', () => {
      it('returns null', async () => {
        const user = await userFactory.create('user', { password: 'myawesomepassword' });
        const { email } = user;
        const found = await User.findByEmailAndPassword({ email, password: 'fake' });
        expect(found).to.be.null;
      });
    });
  });

  describe('prototype.correctPassword()', () => {
    let user;

    beforeEach(async () => {
      user = await userFactory.create('user', { password: 'password123' });
    });

    it('returns true when password is correct', async () => {
      const correct = await user.correctPassword('password123');
      expect(correct).to.be.true;
    });

    it('returns false when password is not correct', async () => {
      const correct = await user.correctPassword('incorrect');
      expect(correct).to.be.false;
    });
  });

  describe('prototype.notebooks()', () => {
    let user;
    let notebook1;
    let notebook2;

    beforeEach(async () => {
      user = await userFactory.create('user');
      const createdAt = moment().subtract(1, 'day').toDate();
      notebook1 = await notebookFactory.create('notebook', { user, createdAt });
      notebook2 = await notebookFactory.create('notebook', { user });
      await notebookFactory.create('notebook');
    });

    it('returns all the notebooks for a user ordered by createdAt asc', async () => {
      const notebooks = await user.notebooks();
      expect(notebooks).to.have.lengthOf(2);
      expect(notebooks[0].toJSON()).to.eql(notebook1.toJSON());
      expect(notebooks[1].toJSON()).to.eql(notebook2.toJSON());
    });

    it('accepts an order argument', async () => {
      const notebooks = await user.notebooks({ sort: { createdAt: 'desc' } });
      expect(notebooks).to.have.lengthOf(2);
      expect(notebooks[0].toJSON()).to.eql(notebook2.toJSON());
      expect(notebooks[1].toJSON()).to.eql(notebook1.toJSON());
    });
  });
});
