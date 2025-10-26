import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import taskRoutes from './routes/tasks.js';
import authRoutes, { authMiddleware } from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('✅ BaseConnect API is running...');
});

app.use('/api/auth', authRoutes);

// example of protected tasks route extension
app.use('/api/tasks', authMiddleware, taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = config.port || 3000;

async function start() {
  try {
    if (!config.mongoUri) {
      throw new Error('Missing MONGODB_URI in environment');
    }
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();