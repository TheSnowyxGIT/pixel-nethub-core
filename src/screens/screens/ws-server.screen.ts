import { PixelMatrix } from 'pixels-matrix';
import { IScreen } from '../screen.interface';
import { WebSocketServer, WebSocket } from 'ws';

export default class WSServerScreen extends IScreen {
  private wss: WebSocketServer;
  private port: number;
  private clients = new Set<WebSocket>();
  private matrix_: PixelMatrix;

  constructor(config: unknown) {
    super(WSServerScreen.name);
    this.port = config['port'];
    if (!this.port) {
      this.port = 3001;
      this.logger.warn(`No port specified. Using default ${this.port}`);
    }
    this.initServer();
  }

  private initServer(): void {
    this.wss = new WebSocketServer({ port: this.port });
    setTimeout(() => {
      this.fn?.();
    }, 100);

    this.wss.on('connection', (ws) => {
      this.logger.log('Client connected');
      this.clients.add(ws);
      this.render(this.matrix_);

      ws.on('close', () => {
        this.logger.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error: ${error.message}`);
      });
    });

    this.logger.log(`WebSocket server started on port ${this.port}`);
  }

  public close(): void {
    this.logger.log('Closing RemoteWSScreen...');
    this.wss.close(() => {
      this.logger.log('WebSocket server closed');
    });
  }

  public render(matrix: PixelMatrix): void {
    if (!matrix) {
      return;
    }
    this.matrix_ = matrix;
    const data = matrix.ToArray().buffer;
    for (const ws of this.clients) {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    }
  }
}
