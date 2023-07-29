import { CustomError } from './custom-error';

export class NotPermittedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Permitted');

    Object.setPrototypeOf(this, NotPermittedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not permitted' }];
  }
}
