import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import commentRouter from './routes/comment.routes';
import userRouter from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/comments', commentRouter);
app.use('/api/users', userRouter);

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});

app.get('/', (_req, res) => {
  res.send('Welcome to the Project Tracker API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
