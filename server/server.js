import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { json } from 'express';
import submissionRoutes from './router/submissionRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/submission', submissionRoutes);

export default app;
