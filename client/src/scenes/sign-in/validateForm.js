import { EmailInvalidError, PasswordInvalidError } from '../../errors';
import { EMAIL_REGEX } from '../../constants';

const validateForm = function validateForm({ email, password }) {
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push(new EmailInvalidError());
  }

  if (!password) {
    errors.push(new PasswordInvalidError());
  }

  return { errors };
};

export default validateForm;
