// src/socketManager.ts
import { Server as SocketIOServer, Socket } from "socket.io";

export class SocketManager {
  private static io: SocketIOServer;
  private static instance: SocketManager;
  private sockets: Map<string, Socket>;

  // Private constructor to enforce singleton usage
  private constructor(io: SocketIOServer) {
    SocketManager.io = io;
    this.sockets = new Map();
  }

  /**
   * Initializes the SocketManager singleton.
   * Call this once when your server starts.
   */
  public static initialize(io: SocketIOServer): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(io);
      console.log("SocketManager initialized");
    }
    return SocketManager.instance;
  }

  /**
   * Returns the singleton instance.
   * Ensure that `initialize()` has been called first.
   */
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      throw new Error(
        "SocketManager not initialized. Call SocketManager.initialize(io) first."
      );
    }
    return SocketManager.instance;
  }

  /**
   * Adds a socket to the manager.
   */
  public addSocket(socket: Socket): void {
    this.sockets.set(socket.id, socket);
    console.log(`Socket added: ${socket.id}`);
  }

  /**
   * Removes a socket from the manager.
   */
  public removeSocket(socket: Socket): void {
    this.sockets.delete(socket.id);
    console.log(`Socket removed: ${socket.id}`);
  }

  /**
   * Broadcasts an event to all connected sockets.
   */
  public broadcast(event: string, data: any): void {
    SocketManager.io.emit(event, data);
  }

  /**
   * Emits an event to a specific socket by its ID.
   */
  public emitToSocket(socketId: string, event: string, data: any): void {
    const socket = this.sockets.get(socketId);
    if (socket) {
      socket.emit(event, data);
    } else {
      console.warn(`Socket with id ${socketId} not found`);
    }
  }

  /**
   * Returns a list of all connected socket IDs.
   */
  public getAllSocketIds(): string[] {
    return Array.from(this.sockets.keys());
  }
}
