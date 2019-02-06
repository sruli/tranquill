// eslint-disable-next-line no-useless-escape
const emailRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const validateForm = function validateForm({ email, password }) {
  const errors = { email: false, password: false };

  if (!email || !emailRegex.test(email)) {
    errors.email = true;
  }

  if (!password) {
    errors.password = true;
  }

  const valid = !errors.email && !errors.password;

  return { valid, errors };
};

export default validateForm;
