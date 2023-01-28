class BaseError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

class KeyAlreadyExistError extends BaseError {
  constructor(public key: string, e?: string) {
    super(e);
  }
};

class KeyNotExitError extends BaseError {
  constructor(public key: string, e?: string) {
    super(e);
  }
}

export { KeyAlreadyExistError, KeyNotExitError };