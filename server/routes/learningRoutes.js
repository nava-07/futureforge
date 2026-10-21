const express = require('express');
const router = express.Router();
const { getLearningPath, generateLearningPath, updateProgress } = require('../controllers/learningController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getLearningPath);
router.post('/generate', generateLearningPath);
router.put('/progress', updateProgress);

module.exports = router;
