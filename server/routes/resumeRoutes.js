const express = require('express');
const router = express.Router();
const { 
  uploadResume, 
  analyzeResume, 
  getResumeHistory, 
  getLatestAnalysis,
  getResume,
  updateResume 
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

router.use(protect);

router.post('/upload', uploadMiddleware, uploadResume);
router.post('/analyze', analyzeResume);
router.get('/history', getResumeHistory);
router.get('/latest', getLatestAnalysis);
router.get('/latest-analysis', getLatestAnalysis);
router.get('/builder', getResume);
router.put('/builder', updateResume);

module.exports = router;
