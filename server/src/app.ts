import express from 'express';
import bodyParser from 'body-parser';
import { setupSocket } from './socket.io';
import http from 'http';
import { Server } from 'socket.io';
import { loadRoutes } from './routes';
import cors from 'cors';
import db from './config/database/database';

// Initialize database connection
db
const app = express();

// Use body-parser for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
));

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

// Call the function to load the routes
loadRoutes(app);

// Initialize Socket.IO
setupSocket(io);

// Root Route
app.get('/app', (req, res) => {
  res.send('Hello World');
});



export default httpServer;
