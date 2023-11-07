import { Express } from "express";
import { Server } from "socket.io";

export interface IServerService {
  io: Server;
}
