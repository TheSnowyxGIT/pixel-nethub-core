import { exec, spawn } from 'child_process';
import { AppInstance } from './application/application';
import ScreenService from './screens/screen.service';
import { AppMetadata } from './application/app-metadata';
import Logger from './logger';

const logger = new Logger('App');

export async function executeApplication(appPath: string, config?: unknown) {
  const appMetadata = await AppMetadata.load(appPath);

  if (!config) {
    config = {
      screens: [
        {
          type: 'ws-server',
          config: {},
        },
      ],
    };
    // dry run
    await AppInstance.instantiate(appMetadata, {
      options: {},
      screenService: new ScreenService(config),
    });
  } else {
    await AppInstance.instantiate(appMetadata, {
      options: {},
      screenService: new ScreenService(config),
    });
  }

  logger.log('App started');
}
