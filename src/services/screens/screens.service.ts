import { Service } from "../IService";
import { PackageMetadata } from "../../packages/package-metadata";
import colors = require("colors");
import {
  WSClientScreen,
  WSServerScreen,
  WSSocketIoClientScreen,
} from "./screens";
import { IScreen } from "./screen.interface";
import * as pm from "pixels-matrix";
import {
  Color,
  IScreenService,
  Point,
  SetMatrixOption,
} from "../../packages/interfaces";

const registeredScreens: {
  [key: string]: new (config: unknown, screenSize: [number, number]) => IScreen;
} = {
  "ws-server": WSServerScreen,
  "ws-client": WSClientScreen,
  "ws-socketio-client": WSSocketIoClientScreen,
};

export class ScreensService extends Service implements IScreenService {
  constructor(packageMetaData: PackageMetadata, config: unknown) {
    super(packageMetaData, config, ScreensService.name, colors.cyan);
  }

  private screens_: IScreen[] = [];
  private matrix_: pm.PixelMatrix;

  async load(): Promise<void> {
    let screenSize = this.config["screenSize"];
    if (!screenSize) {
      screenSize = [32, 8];
      this.logger.warn(
        `Screen size not specified. Using default ${screenSize[0]}x${screenSize[1]}`
      );
    } else {
      this.logger.log(`Screen size: ${screenSize[0]}x${screenSize[1]}`);
    }
    this.resolution_ = {
      x: Number(screenSize[0]),
      y: Number(screenSize[1]),
    };
    this.matrix_ = new pm.PixelMatrix(this.resolution.x, this.resolution.y, {
      zigzag: true,
    });

    const screens = this.config["screens"];
    if (!screens || screens.length === 0) {
      this.logger.warn(
        "No screens specified. The service will do nothing without screens"
      );
    } else {
      this.logger.log(`Trying to load ${screens.length} screens...`);
      for (const [index, screen] of Object.entries(screens)) {
        const screenType = screen["type"];
        if (!screenType) {
          this.logger.warn(`Skipping screen [${index}]. Type not specified`);
          continue;
        }
        if (!registeredScreens[screenType]) {
          this.logger.warn(
            `Skipping screen [${index}]. Type [${screenType}] not registered`
          );
          continue;
        }
        const screenConfig = screen["config"];
        if (!screenConfig) {
          this.logger.warn(
            `Skipping screen [${index}][${screenType}]. Config not specified`
          );
          continue;
        }

        try {
          const screenInstance = new registeredScreens[screenType](
            screenConfig,
            [this.resolution.x, this.resolution.y]
          );

          this.screens_.push(screenInstance);
          this.logger.log(
            `Screen [${index}][${screenType}] ${colors.green("VALID")}`
          );
          screenInstance.onLoaded(() => {
            this.logger.log(
              `Screen [${index}][${screenType}] ${colors.green("LOADED")}`
            );
            this.refresh();
          });
        } catch (error) {
          // todo
          throw error;
        }
      }
    }
  }

  private resolution_: Point;
  public get resolution(): Point {
    return this.resolution_;
  }

  private getColor(color: Color): pm.Color {
    if (typeof color === "string") {
      return pm.Color.FromHEX(color);
    } else if (Array.isArray(color)) {
      return new pm.Color(color[0], color[1], color[2], color[3]);
    } else {
      return pm.Color.FromUint32(color);
    }
  }

  clear(refresh?: boolean | undefined): void {
    this.fill("#000000", refresh);
  }
  fill(color: Color, refresh?: boolean | undefined): void {
    this.matrix_.fillColor(this.getColor(color));
    this.refresh(refresh || false);
  }
  setPixel(point: Point, color: Color, refresh?: boolean | undefined): void {
    this.matrix_.setColor(point, this.getColor(color));
    this.refresh(refresh || false);
  }
  setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption | undefined,
    refresh?: boolean | undefined
  ): void {
    this.matrix_.setMatrix(grayScale, this.getColor(color), option);
    this.refresh(refresh || false);
  }

  refresh(condition?: boolean | undefined): void {
    if (condition || condition === undefined) {
      for (const screen of this.screens_) {
        screen.render(this.matrix_);
      }
    }
  }
}
