import { Server, Socket } from 'socket.io';
export const setupSocket = async (io: Server): Promise<void> => {
    io.on('connection', async (socket: Socket) => {
        console.log('Socket.IO client connected', socket.id);


        socket.on('disconnect', () => {
            console.log('Socket.IO client disconnected', socket.id);
        });
    });
}; 