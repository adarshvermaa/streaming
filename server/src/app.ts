import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database/database';
import mrcRoutes from './mrc/routes';
import { errorHandler } from './middileware/errorHandler';
import { setupSocket } from './config/socket.io/socket';
import http from 'http';
import { Server } from 'socket.io';


const app = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Initialize Socket.IO
setupSocket(io);

// Root Route
app.get('/app', (req, res) => {
  res.send('Hello World');
});

// Sync Database
sequelize.sync()
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });



export default httpServer;
