import { CoreError } from "../../errors/CoreError";

export class AppError extends CoreError {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}
