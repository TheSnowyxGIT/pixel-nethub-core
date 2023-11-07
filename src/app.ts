import { exec, spawn } from "child_process";
import { AppInstance } from "./application/application";
import ScreenService from "./screens/screen.service";
import { AppMetadata } from "./application/app-metadata";
import Logger from "./logger";
import { existsSync, readFileSync } from "fs";
import { CoreError } from "./errors/CoreError";
import { linkApp } from "./application/app-linker";

const logger = new Logger("App");

export async function executeApplication(appPath: string, configPath?: string) {
  configPath = configPath || "pnh.app.json";
  if (!existsSync(configPath)) {
    throw new CoreError(`Config file ${configPath} does not exist`);
  }
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf-8"));
  } catch (e) {
    throw new CoreError(`Config file ${configPath} is not valid JSON`);
  }

  const appMetadata = await AppMetadata.load(appPath);

  if (!config.screens || config.screens.length === 0) {
    config.screens = [
      {
        type: "ws-server",
        config: {},
      },
    ];
  }

  // linker
  const linkedElt = linkApp(appMetadata, config);

  await AppInstance.instantiate(appMetadata, {
    options: {},
    ...linkedElt,
  });

  logger.log("App started");
}
