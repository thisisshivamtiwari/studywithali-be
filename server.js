import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import indexRoutes from './routes/indexRoutes.js';
import http from 'http';

dotenv.config();

const app = express();
const ex = http.createServer(app);

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS first
app.use(cors(corsOptions));

// Root route - should be before any auth middleware
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Study with Ali API' });
});

// Other middleware
app.use(express.json({ limit: '100mb' }));
app.use(morgan('dev'));

// API routes
app.use('/api', indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

ex.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});