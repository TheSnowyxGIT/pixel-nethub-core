import { AppError } from "../../utils/errors/AppError";
import {
  Color,
  Font,
  IFontService,
  IScreenService,
  IServerService,
  Point,
} from "../interfaces";
import * as t2m from "text2matrix";
import { PackageBase, PackageStartParams } from "../package-base";

export type AppStartParams = PackageStartParams & {
  screenService: IScreenService;
  serverService?: IServerService;
  fontsService: IFontService;
};
export abstract class AppBase extends PackageBase implements AppStartParams {
  screenService: IScreenService;
  serverService?: IServerService;
  fontsService: IFontService;

  close() {
    process.exit(0);
  }

  private _fpsCap = 30;
  get fpsCap() {
    return this._fpsCap;
  }
  set fpsCap(fps: number) {
    this.fpsCap = fps;
  }

  private setupFinished = false;
  private loopActivated = false;
  private timeoutId: NodeJS.Timeout | null = null;
  deltaTime = 0;
  override async _setup() {
    await this.setup();
    if (this.loopActivated) {
      this._draw();
    }
    this.setupFinished = true;
  }
  _draw() {
    if (!this.loopActivated) {
      return;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    const time = Date.now();
    this.draw();
    this.refresh();
    const timeDiff = Date.now() - time;
    let timeToWait = Math.max(1000 / this._fpsCap - timeDiff, 0);
    this.timeoutId = setTimeout(() => {
      this.deltaTime = (Date.now() - time) / 1000;
      this.timeoutId = null;
      this._draw();
    }, timeToWait);
  }
  draw(): void {}

  get width() {
    return this.screenService.resolution.x;
  }

  get height() {
    return this.screenService.resolution.y;
  }

  loop() {
    this.loopActivated = true;
    if (this.setupFinished) {
      this._draw();
    }
  }

  noLoop() {
    this.loopActivated = false;
  }

  background(color: Color) {
    this.screenService.fill(color);
  }

  setPixel(point: Point, color: Color) {
    this.screenService.setPixel(point, color);
  }

  clear() {
    this.screenService.clear();
  }

  refresh() {
    this.screenService.refresh();
  }

  private _fillColor: Color = "#ffffff";
  fill(color: Color) {
    this._fillColor = color;
  }

  private _textFont: Font;
  textFont(fontFamily: string | string[], fontSubFamily?: string) {
    this._textFont = this.fontsService.getFont(fontFamily, fontSubFamily);
  }
  private _textSize: number = 10;
  textSize(size: number) {
    this._textSize = size;
  }
  private _textLetterSpacing: number = undefined;
  textLetterSpacing(spacing: number) {
    this._textLetterSpacing = spacing;
  }

  textBoxSize(text: string) {
    if (!this._textFont) {
      throw new AppError("No font selected");
    }
    const textInstance = new t2m.Text(text, this._textFont.font, {
      fontSize: this._textSize,
      letterSpacing: this._textLetterSpacing,
      normalizeSize: false,
    });
    return {
      width: textInstance.width,
      height: textInstance.metrics.capHeight,
    };
  }

  text(text: string, point: Point) {
    if (!this._textFont) {
      throw new AppError("No font selected");
    }
    const textInstance = new t2m.Text(text, this._textFont.font, {
      fontSize: this._textSize,
      letterSpacing: this._textLetterSpacing,
      normalizeSize: false,
    });
    const offset = [
      point.x - textInstance.pivot.x,
      point.y - textInstance.pivot.y,
    ];
    this.screenService.setMatrix(textInstance.matrix, this._fillColor, {
      xOffset: offset[0],
      yOffset: offset[1],
    });
    return {
      x1: offset[0],
      y1: offset[1],
      x2: offset[0] + textInstance.width,
      y2: offset[1] + textInstance.metrics.capHeight,
      width: textInstance.width,
      height: textInstance.metrics.capHeight,
    };
  }
}
