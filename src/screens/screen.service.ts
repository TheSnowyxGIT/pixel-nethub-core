import { Color, Point, SetMatrixOption } from '../application/public';
import Logger from '../logger';
import * as pm from 'pixels-matrix';
import { IScreen } from './screen.interface';
import colors = require('colors');
import WSServerScreen from './screens/ws-server.screen';

const registeredScreens: { [key: string]: new (config: unknown) => IScreen } = {
  'ws-server': WSServerScreen,
};

export default class ScreenService {
  private screens_: IScreen[] = [];
  private logger = new Logger(ScreenService.name);
  private matrix_: pm.PixelMatrix;

  private resolution_: Point;
  public get resolution(): Point {
    return this.resolution_;
  }

  constructor(config: unknown) {
    let screenSize = config['screenSize'];
    if (!screenSize) {
      screenSize = [32, 8];
      this.logger.warn(
        `Screen size not specified. Using default ${screenSize[0]}x${screenSize[1]}`,
      );
    } else {
      this.logger.log(`Screen size: ${screenSize[0]}x${screenSize[1]}`);
    }
    this.resolution_ = {
      x: Number(screenSize[0]),
      y: Number(screenSize[1]),
    };
    this.matrix_ = new pm.PixelMatrix(this.resolution.x, this.resolution.y);

    const screens = config['screens'];
    if (!screens || screens.length === 0) {
      this.logger.warn(
        'No screens specified. The service will do nothing without screens',
      );
    } else {
      this.logger.log(`Trying to load ${screens.length} screens...`);
      for (const [index, screen] of Object.entries(screens)) {
        const screenType = screen['type'];
        if (!screenType) {
          this.logger.warn(`Skipping screen [${index}]. Type not specified`);
          continue;
        }
        if (!registeredScreens[screenType]) {
          this.logger.warn(
            `Skipping screen [${index}]. Type [${screenType}] not registered`,
          );
          continue;
        }
        const screenConfig = screen['config'];
        if (!screenConfig) {
          this.logger.warn(
            `Skipping screen [${index}][${screenType}]. Config not specified`,
          );
          continue;
        }

        try {
          const screenInstance = new registeredScreens[screenType](
            screenConfig,
          );

          this.screens_.push(screenInstance);
          this.logger.log(
            `Screen [${index}][${screenType}] ${colors.green('VALID')}`,
          );
          screenInstance.onLoaded(() => {
            this.logger.log(
              `Screen [${index}][${screenType}] ${colors.green('LOADED')}`,
            );
            this.refresh.bind(this);
          });
        } catch (error) {
          // todo
        }
      }
    }
  }

  private getColor(color: Color): pm.Color {
    if (typeof color === 'string') {
      return pm.Color.FromHEX(color);
    } else if (Array.isArray(color)) {
      return new pm.Color(color[0], color[1], color[2]);
    } else {
      return pm.Color.FromUint32(color);
    }
  }

  clear(refresh?: boolean | undefined): void {
    this.fill('#000000', refresh);
  }
  fill(color: Color, refresh?: boolean | undefined): void {
    this.matrix_.fillColor(this.getColor(color));
    this.refresh(refresh);
  }
  setPixel(point: Point, color: Color, refresh?: boolean | undefined): void {
    this.matrix_.setColor(point, this.getColor(color));
    this.refresh(refresh);
  }
  setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption | undefined,
    refresh?: boolean | undefined,
  ): void {
    this.matrix_.setMatrix(grayScale, this.getColor(color), option);
    this.refresh(refresh);
  }
  refresh(condition?: boolean | undefined): void {
    if (condition || condition === undefined) {
      for (const screen of this.screens_) {
        screen.render(this.matrix_);
      }
    }
  }
}
