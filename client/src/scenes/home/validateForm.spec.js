import validateForm from './validateForm';
import { EmailInvalidError } from '../../errors';

describe('validateForm', () => {
  describe('when email is valid', () => {
    it('returns null', () => {
      expect(validateForm({ email: 'email@example.com' })).toBeNull();
    });
  });

  describe('when email is blank', () => {
    it('returns an error message', () => {
      expect(validateForm({ email: '' })).toBeInstanceOf(EmailInvalidError);
    });
  });

  describe('when email is not valid', () => {
    it('returns an error message', () => {
      expect(validateForm({ email: 'foo' })).toBeInstanceOf(EmailInvalidError);
    });
  });
});
