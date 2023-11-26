import { CoreError } from "./CoreError";

export class AppError extends CoreError {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}
