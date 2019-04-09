import { EMAIL_REGEX } from '../../constants';
import { EmailInvalidError } from './errors';

const validateForm = function validateEmailSignup({ email }) {
  let error = null;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    error = new EmailInvalidError();
  }

  return error;
};

export default validateForm;
