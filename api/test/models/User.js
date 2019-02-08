const mongoose = require('mongoose');
const { expect } = require('chai');
const userFactory = require('../factories/userFactory');

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
});
