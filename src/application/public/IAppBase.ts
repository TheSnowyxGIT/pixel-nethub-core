import { IServerService } from "./iServerService";
import { IFontService } from "./iFontService";
import { IScreenService } from "./iScreenService";

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

  abstract onStart(): Promise<void> | void;
  abstract onStop(): Promise<void> | void;
}
