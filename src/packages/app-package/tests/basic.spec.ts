import { Font } from "../../interfaces";
import { AppBase, AppStartParams } from "../app";

class AppTester extends AppBase {
  async setup() {
    return;
  }
}

describe("App Methods", () => {
  let app: AppBase;
  beforeEach(() => {
    jest.restoreAllMocks();
    app = new AppTester();
    const appStartParams: AppStartParams = {
      options: {},
      screenService: {
        resolution: { x: 32, y: 8 },
        clear: jest.fn().mockImplementation(),
        fill: jest.fn().mockImplementation(),
        setPixel: jest.fn().mockImplementation(),
        setMatrix: jest.fn().mockImplementation(),
        refresh: jest.fn().mockImplementation(),
      },
      serverService: {
        io: {} as any,
      },
      fontsService: {
        getLoadedFonts: function (): Promise<Font[]> {
          throw new Error("Function not implemented.");
        },
        getFont: function (
          fontFamily: string | string[],
          fontSubFamily?: string | undefined
        ): Font {
          throw new Error("Function not implemented.");
        },
      },
    };
    Object.assign(app, appStartParams);
  });

  it("should have give the resolution", () => {
    expect(app.width).toBe(32);
    expect(app.height).toBe(8);
  });

  it("should close the process", () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation();
    app.close();
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("background method, should call fill with the given color", () => {
    app.background("#ff0000");
    expect(app.screenService.fill).toHaveBeenCalledWith("#ff0000");
    expect(app.screenService.refresh).not.toHaveBeenCalled();
  });

  it("setPixel method, should call setPixel with the given point and color", () => {
    app.setPixel({ x: 1, y: 2 }, "#ff0000");
    expect(app.screenService.setPixel).toHaveBeenCalledWith(
      { x: 1, y: 2 },
      "#ff0000"
    );
    expect(app.screenService.refresh).not.toHaveBeenCalled();
  });

  it("clear method, should call clear", () => {
    app.clear();
    expect(app.screenService.clear).toHaveBeenCalled();
    expect(app.screenService.refresh).not.toHaveBeenCalled();
  });

  it("refresh method, should call refresh", () => {
    app.refresh();
    expect(app.screenService.refresh).toHaveBeenCalled();
  });
});
