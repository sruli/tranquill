// eslint-disable-next-line no-useless-escape
const emailRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const validateForm = function validateForm({ email, password }) {
  const errors = [];

  if (!email || !emailRegex.test(email)) {
    errors.push('Enter an email');
  }

  if (!password) {
    errors.push('Enter a password');
  }

  return { errors };
};

export default validateForm;
