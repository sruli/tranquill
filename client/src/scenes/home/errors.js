class EmailInvalidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailInvalidError';
  }
}

class EmailSubmitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailSubmitError';
  }
}

export {
  EmailInvalidError,
  EmailSubmitError,
};
