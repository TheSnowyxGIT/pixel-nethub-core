import { PackageMetadata } from "../packages/package-metadata";
import colors = require("colors");
import Logger from "../utils/logger";

export abstract class Service {
  packageMetaData: PackageMetadata;
  config: unknown;
  logger: Logger;
  constructor(
    packageMetaData: PackageMetadata,
    config: unknown,
    name: string,
    color?: colors.Color
  ) {
    this.packageMetaData = packageMetaData;
    this.config = config;
    this.logger = new Logger(name, color);
  }
  abstract load(): Promise<void>;
}
