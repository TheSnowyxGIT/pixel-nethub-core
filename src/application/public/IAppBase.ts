import { IFontService } from './iFontService';
import { IScreenService } from './iScreenService';

export interface AppStartParams {
  options: any;
  screenService: IScreenService;
  // fontsService: IFontService;
}

export type AppBaseConstructor = new () => AppBase;
export abstract class AppBase implements AppStartParams {
  options: any;
  screenService: IScreenService;
  fontsService: IFontService;

  abstract onStart(): Promise<void> | void;
  abstract onStop(): Promise<void> | void;
}
