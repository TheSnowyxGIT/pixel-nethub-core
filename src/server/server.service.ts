import { Server } from "socket.io";
import { AppMetadata } from "../application";
import { IServerService } from "../application/public/iServerService";
import Logger from "../logger";
import express = require("express");
import path = require("path");

export class ServerService implements IServerService {
  private readonly logger = new Logger(ServerService.name);
  private readonly port: number;
  private readonly app: express.Express;
  public readonly io: Server;
  constructor(appMetadata: AppMetadata, config: unknown) {
    this.port = config["port"];
    if (!this.port) {
      this.port = 8080;
      this.logger.warn(`Port not specified. Using default ${this.port}`);
    }
    this.app = express();
    this.app.use(
      express.static(path.join(appMetadata.appPath, appMetadata.publicPath))
    );
    const server = this.app.listen(this.port, () => {
      this.logger.log(`Listening on port ${this.port}`);
    });
    this.io = new Server(server);
  }
}
