import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import submissionRoutes from './router/submissionRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// MongoDB Connection
let isConnected;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    const db = await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Connect to the database before handling requests
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Routes
app.use('/submission', submissionRoutes);