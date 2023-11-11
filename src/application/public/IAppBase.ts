import { IServerService } from "./iServerService";
import { Font, IFontService } from "./iFontService";
import { Color, IScreenService, Point } from "./iScreenService";
import { text2matrix } from "text2matrix";

export interface AppStartParams {
  options: any;
  screenService: IScreenService;
  serverService?: IServerService;
  // fontsService: IFontService;
}

export type AppBaseConstructor = new () => AppBase;
export abstract class AppBase implements AppStartParams {
  options: any;
  screenService: IScreenService;
  fontsService: IFontService;
  serverService?: IServerService;

  private loopActivated = false;
  private timeoutId: NodeJS.Timeout | null = null;
  deltaTime = 0;
  async _setup() {
    await this.setup();
    if (this.loopActivated) {
      this._draw();
    }
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
    let timeToWait = Math.max(1000 / 60 - timeDiff, 0);
    this.timeoutId = setTimeout(() => {
      this.deltaTime = (Date.now() - time) / 1000;
      this.timeoutId = null;
      this._draw();
    }, timeToWait);
  }

  abstract setup(): Promise<void> | void;
  draw(): void {}

  get width() {
    return this.screenService.resolution.x;
  }

  get height() {
    return this.screenService.resolution.y;
  }

  loop() {
    this.loopActivated = true;
    this._draw();
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

  //* text functions

  private _textFont: Font;
  textFont(fontFamily: string | string[], fontSubFamily?: string) {
    this._textFont = this.fontsService.getFont(fontFamily, fontSubFamily);
  }
  private _textSize: number | string = 10;
  textSize(size: number) {
    this._textSize = size;
  }
  // textBoxSize(text: string) {
  //   // text2matrix(text);
  // }

  // }
  // text(text: string, point: Point) {}
}
