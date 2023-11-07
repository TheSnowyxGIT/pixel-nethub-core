import path = require('path');
import { AppError } from './errors/AppError';
import { AppBase, AppBaseConstructor, AppStartParams } from './public';
import { AppMetadata } from './app-metadata';

export class AppInstance {
  static async instantiate(appMetaData: AppMetadata, context: AppStartParams) {
    const instance = new AppInstance(appMetaData);
    await instance.loadApp();
    await instance.start(context);
    return instance;
  }

  private appBaseInstance: AppBase | null = null;
  private appConstructor?: AppBaseConstructor;

  private constructor(public readonly appMetaData: AppMetadata) {}

  async loadApp() {
    let importedObj: any;
    try {
      importedObj = await import(path.resolve(this.appMetaData.appPath));
    } catch (e) {
      throw new AppError('Error loading app');
    }
    if (importedObj && importedObj.default) {
      importedObj = importedObj.default;
    }
    this.appConstructor = importedObj as AppBaseConstructor;
  }

  async start(context: AppStartParams) {
    if (this.appBaseInstance !== null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    this.appBaseInstance = new this.appConstructor();
    Object.assign(this.appBaseInstance, context);
    await this.appBaseInstance.onStart();
  }

  async stop() {
    if (this.appBaseInstance === null) {
      return;
    }
    if (!this.appConstructor) {
      throw new AppError('App not loaded');
    }
    await this.appBaseInstance.onStop();
    this.appBaseInstance = null;
  }
}
