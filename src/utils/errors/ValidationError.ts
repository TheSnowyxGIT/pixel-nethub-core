import { CoreError } from "./CoreError";

export class ValidationError extends CoreError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
