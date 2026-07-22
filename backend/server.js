import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import pool from './config/db.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Logging Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Body Parsing Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static Asset Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

// Centralized Error Handling
app.use(errorHandler);

// Database Health Check & Startup
const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL Database connected successfully.');
    connection.release();

    app.listen(env.port, () => {
      logger.info(`TwinEval AI Backend server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    logger.error('Database connection failed. Launching server in fallback mode:', error.message);
    app.listen(env.port, () => {
      logger.info(`TwinEval AI Backend server running on http://localhost:${env.port} (Database offline)`);
    });
  }
};

startServer();
