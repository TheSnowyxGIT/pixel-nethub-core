import { executeApplication } from "./app";

// executeApplication('../../customApps/time-app', {
//   screenSize: [32, 8],
// });

import { Command } from "commander";
import { validateApp } from "./application/validator/validator.service";
import { readFileSync } from "fs";
import { CoreError } from "./errors/CoreError";
import Logger from "./logger";
const program = new Command();
const logger = new Logger("CORE");

function actionErrorHandler(error: Error) {
  if (error instanceof CoreError) {
    logger.error(error.message);
    process.exit(1);
  }
  throw error;
}

export function actionRunner(fn: (...args) => Promise<any>) {
  return (...args) => fn(...args).catch(actionErrorHandler);
}

program.name("pnh-core").description("todo").version("1.0.0");

program
  .command("validate")
  .description("validate an app")
  .argument("<appPath>", "path to app (folder or zip)")
  .action(
    actionRunner(async (str, options) => {
      validateApp(str);
    })
  );

program
  .command("run")
  .description("run an app")
  .argument("<appPath>", "path to app (folder)")
  .option("-c, --config <path>", "path to config file")
  .action(
    actionRunner(async (appPath, options) => {
      await executeApplication(appPath, options.config);
    })
  );

program.parse();
