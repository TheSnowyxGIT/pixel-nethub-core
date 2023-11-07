import { executeApplication } from './app';

// executeApplication('../../customApps/time-app', {
//   screenSize: [32, 8],
// });

import { Command } from 'commander';
import { validateApp } from './application/validator/validator.service';
import { readFileSync } from 'fs';
const program = new Command();

program.name('pnh-core').description('todo').version('1.0.0');

program
  .command('validate')
  .description('validate an app')
  .argument('<appPath>', 'path to app (folder or zip)')
  .action((str, options) => {
    validateApp(str);
  });

program
  .command('run')
  .description('run an app')
  .argument('<appPath>', 'path to app (folder)')
  .option('-c, --config <path>', 'path to config file')
  .action((appPath, options) => {
    console.log(appPath, options);
    let config = undefined;
    if (options.config) {
      config = JSON.parse(readFileSync(options.config, 'utf-8'));
    }
    executeApplication(appPath, config);
  });

program.parse();
