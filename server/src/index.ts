import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import commentRouter from './routes/comment.routes';
import userRouter from './routes/user.routes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
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

app.get('/', (_req, res) => {
  res.send('Welcome to the Project Tracker API!');
});

// Add this at the end of the file, after all routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
