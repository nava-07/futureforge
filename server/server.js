const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');
const { generalLimiter, aiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobMatchRoutes = require('./routes/jobMatchRoutes');
const learningRoutes = require('./routes/learningRoutes');
const projectRoutes = require('./routes/projectRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', generalLimiter, profileRoutes);
app.use('/api/skills', generalLimiter, skillRoutes);
app.use('/api/resume', generalLimiter, resumeRoutes);
app.use('/api/job-match', generalLimiter, jobMatchRoutes);
app.use('/api/learning-path', generalLimiter, learningRoutes);
app.use('/api/projects', generalLimiter, projectRoutes);
app.use('/api/portfolio', generalLimiter, portfolioRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
