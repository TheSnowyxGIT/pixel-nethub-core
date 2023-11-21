import { PixelMatrix } from "pixels-matrix";
import { IScreen } from "../screen.interface";
import { AppError } from "../../application/errors/AppError";
import { io, Socket } from "socket.io-client";

export default class WSSocketIoClientScreen extends IScreen {
  private url: string;
  private namespace: string;
  private ws: Socket;
  private matrix_: PixelMatrix;

  constructor(config: unknown, private readonly screenSize: [number, number]) {
    super(WSSocketIoClientScreen.name);
    this.url = config["url"];
    if (!this.url) {
      throw new AppError("WebSocket server URL must be specified");
    }
    this.namespace = config["namespace"] ?? "/";

    this.connectToServer();
  }

  private connectToServer(): void {
    this.ws = io(new URL(this.namespace, this.url).toString());

    this.ws.on("connect", () => {
      this.logger.log("Connected to server");
      this.fn?.();
    });

    this.ws.on("disconnect", () => {
      this.logger.log("Disconnected from server");
    });

    this.ws.on("error", (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });
  }

  public render(matrix: PixelMatrix): void {
    if (!matrix || !this.ws.connected) {
      return;
    }
    this.matrix_ = matrix;
    const data = matrix.ToArray().buffer;
    this.ws.emit("data", data);
  }

  public close(): void {
    this.logger.log("Closing WSClientScreen...");
    this.ws.close();
  }
}
