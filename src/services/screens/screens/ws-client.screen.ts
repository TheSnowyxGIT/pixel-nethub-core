import { PixelMatrix } from "pixels-matrix";
import { IScreen } from "../screen.interface";
import { WebSocket } from "ws";
import { AppError } from "../../../utils/errors/AppError";

export class WSClientScreen extends IScreen {
  private ws: WebSocket;
  private url: string;
  private matrix_: PixelMatrix;

  constructor(config: unknown, private readonly screenSize: [number, number]) {
    super(WSClientScreen.name);
    this.url = config["url"];
    if (!this.url) {
      throw new AppError("WebSocket server URL must be specified");
    }
    this.connectToServer();
  }

  private connectToServer(): void {
    this.ws = new WebSocket(this.url);

    this.ws.on("open", () => {
      this.logger.log("Connected to server");
      this.fn?.();
    });

    this.ws.on("close", () => {
      this.logger.log("Disconnected from server");
    });

    this.ws.on("error", (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });
  }

  public render(matrix: PixelMatrix): void {
    console.log("render", this.ws.readyState, WebSocket.OPEN);
    if (!matrix || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    this.matrix_ = matrix;
    const data = matrix.ToArray().buffer;
    this.ws.send(data);
  }

  public close(): void {
    this.logger.log("Closing WSClientScreen...");
    this.ws.close(1000, "Client closing connection");
  }
}
