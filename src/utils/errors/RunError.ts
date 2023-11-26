import { CoreError } from "./CoreError";

export class RunError extends CoreError {
  constructor(message: string) {
    super(message);
    this.name = "RunError";
  }
}
