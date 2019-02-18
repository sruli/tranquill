import validateForm from './validateForm';

describe('validateForm', () => {
  const defaultArgs = { email: 'email@example.com', password: 'password' };

  describe('when there are no errors', () => {
    it('returns no errors', () => {
      const { errors } = validateForm(defaultArgs);
      expect(errors).toEqual([]);
    });
  });

  describe('when email is missing', () => {
    it('adds an email error', () => {
      const { errors } = validateForm({ ...defaultArgs, email: '' });
      expect(errors).toHaveLength(1);
      expect(errors).toContain('Enter an email');
    });
  });

  describe('when email is not valid', () => {
    it('adds an email error', () => {
      const { errors } = validateForm({ ...defaultArgs, email: 'invalid' });
      expect(errors).toHaveLength(1);
      expect(errors).toContain('Enter an email');
    });
  });

  describe('when password is missing', () => {
    it('adds a password error', () => {
      const { errors } = validateForm({ ...defaultArgs, password: '' });
      expect(errors).toHaveLength(1);
      expect(errors).toContain('Enter a password');
    });
  });

  describe('when email and password has errors', () => {
    it('adds both errors', () => {
      const { errors } = validateForm({ email: '', password: '' });
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Enter an email');
      expect(errors).toContain('Enter a password');
    });
  });
});
