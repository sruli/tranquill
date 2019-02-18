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

export {
  ClientError,
  ServerError,
};
