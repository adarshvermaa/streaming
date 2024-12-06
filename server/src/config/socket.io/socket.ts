import { Server, Socket } from 'socket.io';
import { ENV } from '../env';
import { sendToKafka } from '../kafka/kafka';

export const setupSocket = async (io: Server): Promise<void> => {
  io.on('connection', (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Example event: Message from client
    socket.on('message', async(data) => {
      console.log(`Message from ${socket.id}: ${data}`);
      await sendToKafka(ENV.KAFKA_TOPIC, data);
      // Emit to all connected clients
      io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
