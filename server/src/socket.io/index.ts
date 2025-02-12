import { Server as SocketIOServer, Socket } from "socket.io";
import { SocketManager } from "./socketManager";
import { withSocketErrorHandling } from "./socketWrapper";

export class SocketConnections {
  public static createSocketConnections(io: SocketIOServer): void {
    // Initialize the SocketManager with the Socket.IO instance
    SocketManager.initialize(io);

    // Handle Socket.IO connections
    io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      // Add the socket to the manager
      SocketManager.getInstance().addSocket(socket);

      // Use the higher-order function to wrap your event handler
      socket.on(
        "customEvent",
        withSocketErrorHandling(async (socket, data) => {
          // Your custom event logic here
          console.log(`Received customEvent from ${socket.id}:`, data);

          // Optionally, emit a response back
          socket.emit("customResponse", { message: "Event processed" });
        })
      );

      // Remove socket on disconnect
      socket.on("disconnect", () => {
        SocketManager.getInstance().removeSocket(socket);
        console.log("Client disconnected:", socket.id);
      });
    });
  }
}
