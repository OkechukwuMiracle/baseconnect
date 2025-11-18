import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import taskRoutes from './routes/tasks.js';
import authRoutes, { authMiddleware } from './routes/auth.js';
import waitlistRoutes from './routes/waitlist.js';
import verificationRoutes from './routes/verification.js';
import profileRoutes from './routes/profile.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080", // your frontend URL
    credentials: true, // if using cookies / tokens
  }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('✅ BaseConnect API is running...');
});

app.use('/api/auth', authRoutes);

// example of protected tasks route extension
app.use('/api/tasks', taskRoutes);

// Waitlist routes
app.use('/api/waitlist', waitlistRoutes);

// Verification routes
app.use('/api/task', verificationRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

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