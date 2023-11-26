import { PixelMatrix } from "pixels-matrix";
import Logger from "../../utils/logger";
import colors = require("colors");

export abstract class IScreen {
  protected logger: Logger;
  constructor(name: string) {
    this.logger = new Logger(name, colors.blue);
  }
  public abstract render(matrix: PixelMatrix): void;
  protected fn?: () => void;
  public onLoaded(fn: () => void): void {
    this.fn = fn;
  }
  public abstract close(): void;
}
