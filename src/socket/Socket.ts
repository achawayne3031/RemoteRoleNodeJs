
import express from 'express';
import { createServer } from 'node:http';
const env = require('dotenv').config({ debug: process.env.DEBUG })
import { Server } from 'socket.io';

export const port = process.env.PORT || 4000;
export const app = express();
export const server = createServer(app);
export const io = new Server(server, { cors: { origin: '*'}, maxHttpBufferSize: 1e8});



