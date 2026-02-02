import { AppError } from './app-error.js';

export class ValidationError extends AppError {
  private readonly details: Array<string>;
  constructor(message: string, details: Array<string>) {
    super(message, 400);
    this.details = details;
  }
}
