import express from 'express';
import bodyParser from 'body-parser';
import { setupSocket } from './socket.io';
import http from 'http';
import { Server } from 'socket.io';
import { loadRoutes } from './main/routes';
import cors from 'cors';
import db from './config/database/database';
import session from 'express-session';
import { ENV } from './config/env';
import authRoutes, { googleAuthMiddleware } from './middileware/googleAuth.middlewear';

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
app.use(
  session({
    secret: ENV.SESSION_SECRET!, // Store in .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

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

//passportMiddlewear
googleAuthMiddleware(app);
// Use Auth Routes
app.use('/api/v1/users', authRoutes);


// Root Route
app.get('/api/server', (req, res) => {
  res.send('Hello World');
});



export default httpServer;
