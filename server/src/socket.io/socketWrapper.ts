// src/utils/socketWrapper.ts
import { Socket } from "socket.io";

/**
 * A higher-order function that wraps a socket event handler.
 * It catches any errors thrown by the handler and emits an error event to the client.
 *
 * @param handler The original socket event handler.
 * @returns A new function that wraps the original handler with error handling.
 */
export function withSocketErrorHandling(
  handler: (socket: Socket, data: any) => Promise<void> | void
) {
  return async (socket: Socket, data: any) => {
    try {
      await handler(socket, data);
    } catch (error) {
      console.error("Error in socket event handler:", error);
      socket.emit("error", { message: "Internal server error" });
    }
  };
}
