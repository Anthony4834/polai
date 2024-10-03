const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isConnected;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
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
const submissionRoutes = require('./router/submissionRoutes');
app.use('/submission', submissionRoutes);

app.listen(3001, () => console.log('Listening');