import express from 'express';
import sequelize from './config/database/database';
import mrcRoutes from './mrc/routes';
import { errorHandler } from './middileware/errorHandler';
import { setupSocket } from './config/socket.io/socket';
import http from 'http';
import { Server } from 'socket.io';
import { setupKafka } from './config/kafka/kafka';


const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*'],
    credentials: true,

  },
});

//connect socket
setupSocket(io);

//connect kafka
setupKafka(io);

app.use(express.json());
app.use('/api', mrcRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World');
});

sequelize.sync().then(( ) => {
  console.log('Database connected and synced');
});

export default app;
