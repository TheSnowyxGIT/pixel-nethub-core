import { AppInstance } from "./application/application";
import ScreenService from "./screens/screen.service";
import { AppMetadata } from "./application/app-metadata";
import Logger from "./logger";
import { CoreError } from "./errors/CoreError";
import { linkApp } from "./application/app-linker";
import { existsSync, readFileSync } from "fs";
import { spawn } from "child_process";
import colors = require("colors");

const logger = new Logger("App");

export async function executeApplication(appPath: string, options: any) {
  const configPath = options.config || "pnh.app.json";
  if (!existsSync(configPath)) {
    throw new CoreError(`Config file ${configPath} does not exist`);
  }
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf-8"));
  } catch (e) {
    throw new CoreError(`Config file ${configPath} is not valid JSON`);
  }
  config.not_open_browser = options.notOpenBrowser;

  const appMetadata = await AppMetadata.load(appPath);

  if (!config.screens || config.screens.length === 0) {
    const port = 8091;
    config.screens = [
      {
        type: "ws-server",
        config: {
          port,
        },
      },
    ];
    if (!config.not_open_browser) {
      startEmulator(port);
    }
  }

  // linker
  const linkedElt = linkApp(appMetadata, config);

  await AppInstance.instantiate(appMetadata, {
    options: {},
    ...linkedElt,
  });

  logger.log("App started");
}

function startEmulator(wsPort: number) {
  const logger = new Logger("Emulator", colors.green);
  logger.log(`Starting emulator communication on port ${wsPort}`);
  const uiPort = 8989;
  const uiDomain = "localhost";
  logger.log(`Emulator UI available on http://${uiDomain}:${uiPort}`);
  spawn("npx", ["pnh-emulator"], {
    env: {
      ...process.env,
      WS_URL: `ws://localhost:${wsPort}`,
      DOMAIN: uiDomain,
      PORT: uiPort.toString(),
    },
  });
}
