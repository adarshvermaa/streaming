import { Server, Socket } from 'socket.io';
import { ENV } from '../env';
import { sendToKafka } from '../kafka/kafka';

// Message handling for group chat
const handleMessage = async (socket: Socket, io: Server, room: string, data: string): Promise<void> => {
  console.log(`Message from ${socket.id} in room ${room}: ${data}`);

  // Validate data
  if (!data || typeof data !== 'string') {
    console.error('Invalid message received:', data);
    socket.emit('error', 'Invalid message format'); // Optionally emit an error to the client
    return;
  }

  try {
    // Emit the message to all connected clients in the room
    io.to(room).emit('message', { userId: socket.id, message: data });
  } catch (err) {
    console.error('Error handling message:', err);
    socket.emit('error', 'Failed to process the message'); // Notify the client about the error
  }
};

// Join room for group chat
const joinRoom = (socket: Socket, room: string): void => {
  socket.join(room);
  console.log(`User ${socket.id} joined room: ${room}`);
};

// Leave room for group chat
const leaveRoom = (socket: Socket, room: string): void => {
  socket.leave(room);
  console.log(`User ${socket.id} left room: ${room}`);
};

// Handle live stream signaling (WebRTC setup)
const handleLiveStreamSignal = (socket: Socket, signalData: any): void => {
  // Example signalData could include offer, answer, or ICE candidates
  socket.broadcast.emit('stream-signal', { userId: socket.id, ...signalData });
};

// Disconnection handling
const handleDisconnect = (socket: Socket): void => {
  console.log(`User disconnected: ${socket.id}`);
};

// Centralized error handling
const handleError = (socket: Socket, errorMessage: string): void => {
  socket.emit('error', errorMessage); // Emit error to the client
};

// Central function to set up all event handlers
export const setupSocketConnection = (socket: Socket, io: Server): void => {
  console.log(`A user connected: ${socket.id}`);

  // Handle message events (Group Chat)
  socket.on('message', async (room: string, data: string) => {
    await handleMessage(socket, io, room, data);
  });

  // Handle room join
  socket.on('joinRoom', (room: string) => {
    joinRoom(socket, room);
  });

  // Handle room leave
  socket.on('leaveRoom', (room: string) => {
    leaveRoom(socket, room);
  });

  // Handle live stream signaling (e.g., WebRTC)
  socket.on('liveStreamSignal', (signalData: any) => {
    handleLiveStreamSignal(socket, signalData);
  });

  // Handle disconnection events
  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });
};

// Setup the main connection event handler for all incoming sockets
export const setupSocket = async (io: Server): Promise<void> => {
  console.log('Setting up Socket.IO');

  io.on('connection', (socket: Socket) => {
    // Call the new function to handle all socket events
    setupSocketConnection(socket, io);
  });
};
