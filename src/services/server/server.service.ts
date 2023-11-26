import { Server } from "socket.io";
import Logger from "../../utils/logger";
import express = require("express");
import path = require("path");
import { PackageMetadata } from "../../packages/package-metadata";
import { Service } from "../IService";
import colors = require("colors");

export class ServerService extends Service {
  private port: number;
  private app: express.Express;
  public io: Server;

  constructor(packageMetaData: PackageMetadata, config: unknown) {
    super(packageMetaData, config, ServerService.name, colors.green);
  }

  async load(): Promise<void> {
    this.port = this.config["port"];
    if (!this.port) {
      this.port = 8080;
      this.logger.warn(`Port not specified. Using default ${this.port}`);
    }
    this.app = express();
    this.app.use(
      express.static(
        path.join(this.packageMetaData.appPath, this.packageMetaData.publicPath)
      )
    );
    const server = this.app.listen(this.port, () => {
      this.logger.log(`Listening on port ${this.port}`);
    });
    this.io = new Server(server);
  }
}
