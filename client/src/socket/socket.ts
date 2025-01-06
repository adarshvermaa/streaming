import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WEB_SOCKET_URL; // Replace with your server's URL

// Create and export the socket instance
export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures WebSocket connection
  reconnectionAttempts: 5,  // Retry 5 times before failing
  reconnectionDelay: 1000,  // Wait 1 second between attempts
});
