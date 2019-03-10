import { EMAIL_REGEX } from '../../constants';

const validateForm = function validateEmailSignup({ email }) {
  let error = null;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    error = 'Enter an email';
  }

  return error;
};

export default validateForm;
