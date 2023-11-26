import { PackageMetadata, showMetadata } from "./packages/package-metadata";
import { runPackage } from "./packages/run/run";
import { CoreError } from "./utils/errors/CoreError";
import { RunError } from "./utils/errors/RunError";
import { existsSync, readFileSync } from "fs";
import Logger from "./utils/logger";
import colors = require("colors");
import { spawn } from "child_process";

function getConfig(options: any) {
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
  return config;
}

export async function scanPackage(packagePath: string) {
  const packageMetadata = await PackageMetadata.load(packagePath);
  console.log();
  showMetadata(packageMetadata);
}

export async function startPackage(packagePath: string, option: any) {
  const packageMetadata = await PackageMetadata.load(packagePath);

  if (packageMetadata.from === "zip") {
    throw new RunError("Cannot start package from zip for now");
  }

  const config = getConfig(option);

  if (!config.screens || config.screens.length === 0) {
    const port = 8990;
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

  await runPackage(packageMetadata, {}, config);
}

function startEmulator(wsPort: number) {
  const logger = new Logger("Emulator", colors.green);
  logger.log(`Starting emulator communication on port ${wsPort}`);
  const uiPort = 8989;
  const uiDomain = "localhost";
  logger.log(`Emulator UI available on http://${uiDomain}:${uiPort}`);
  const child = spawn("npx", ["pnh-emulator"], {
    env: {
      ...process.env,
      WS_URL: `ws://localhost:${wsPort}`,
      DOMAIN: uiDomain,
      PORT: uiPort.toString(),
    },
  });
  child.stdout.on("data", (data) => {
    //logger.log(data.toString());
  });
  child.stderr.on("data", (data) => {
    //logger.log(data.toString());
  });
  child.on("close", (code) => {
    logger.log(`Emulator exited with code ${code}`);
  });
  process.on("exit", function () {
    child.kill();
  });
}
