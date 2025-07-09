import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

// Route imports
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import commentRouter from './routes/comment.routes';
import userRouter from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/comments', commentRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Murang\'a Project Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Base route
app.get('/', (_req, res) => {
  res.send('Welcome to the Project Tracker API!');
});

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
