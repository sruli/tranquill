import { EMAIL_REGEX } from '../../constants';

const validateForm = function validateForm({ email, password }) {
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push('Enter an email');
  }

  if (!password) {
    errors.push('Enter a password');
  }

  return { errors };
};

export default validateForm;
