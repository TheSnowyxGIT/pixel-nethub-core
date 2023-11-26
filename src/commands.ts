import { Command } from "commander";
import { readFileSync } from "fs";
import { CoreError } from "./utils/errors/CoreError";
import Logger from "./utils/logger";
import { scanPackage, startPackage } from "./main";
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
  .command("scan")
  .description("scan a package")
  .argument("<packagePath>", "path to package (folder or zip)")
  .action(
    actionRunner(async (packagePath, options) => {
      await scanPackage(packagePath);
    })
  );

program
  .command("run")
  .description("run an app")
  .argument("<appPath>", "path to app (folder)")
  .option("-c, --config <path>", "path to config file")
  .option("--not-open-browser", "do not open browser for emulator")
  .action(
    actionRunner(async (appPath, options) => {
      await startPackage(appPath, options);
    })
  );

program.parse();
