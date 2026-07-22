require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const learningPlanRoutes = require('./routes/learningPlanRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Import Error Handlers
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// Express Middleware Configuration
app.use(helmet({ contentSecurityPolicy: false })); // Security Headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(morgan('dev')); // HTTP Request Logging

// Serve Frontend Static Files
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Status Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 TwinEval AI Production Backend is Running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        documentation: '/docs/API_DOCUMENTATION.md',
        timestamp: new Date().toISOString()
    });
});

// API Endpoint Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/evaluations', evaluationRoutes);
app.use('/plans', learningPlanRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', aiRoutes);

// 404 Route Not Found Middleware
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

// Test DB Connection and Start Express Server
const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 TwinEval AI Server Running on Port ${PORT}`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`====================================================`);
    });
};

startServer();

module.exports = app;