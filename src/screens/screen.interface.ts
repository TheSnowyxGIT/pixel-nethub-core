import { PixelMatrix } from "pixels-matrix";
import Logger from "../logger";

export abstract class IScreen {
    protected logger: Logger;
    constructor(name: string) {
        this.logger = new Logger(name);
    }
    public abstract render(matrix: PixelMatrix): void;
    protected fn?: () => void;
    public onLoaded(fn: () => void): void {
      this.fn = fn;
    }
    public abstract close(): void;
  }
