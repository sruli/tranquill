class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
  }
}

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

class PasswordInvalidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PasswordInvalidError';
  }
}

export {
  ClientError,
  ServerError,
  EmailInvalidError,
  EmailSubmitError,
  PasswordInvalidError,
};
