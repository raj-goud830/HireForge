import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { clerkMiddleware, requireAuth } from '@clerk/express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import resumeRoutes from './routes/resume';
import aiRoutes from './routes/ai';
import portfolioRoutes from './routes/portfolio';
import jobRoutes from './routes/jobs';

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Saas backend is running' });
});

app.post('/api/debug-auth', (req: any, res: any) => {
  console.log("--- DEBUG AUTH ---");
  console.log("Auth State:", req.auth);
  console.log("Headers:", req.headers.authorization);
  res.json({ auth: req.auth });
});

app.get('/api/protected', requireAuth(), (req: any, res: any) => {
  res.json({ status: 'ok', userId: req.auth.userId, message: 'This is a protected route' });
});

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env');
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB Atlas', err);
    });
}
