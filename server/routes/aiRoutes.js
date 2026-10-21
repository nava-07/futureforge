const express = require('express');
const router = express.Router();
const { chat, getConversations, getConversation, deleteConversation, skillAnalysis, careerAnalysis } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(protect);
router.use(aiLimiter);

router.post('/chat', chat);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);

router.post('/skill-analysis', skillAnalysis);
router.get('/skill-analysis', skillAnalysis);
router.get('/analysis/skills', skillAnalysis);

router.post('/career-analysis', careerAnalysis);
router.get('/career-analysis', careerAnalysis);
router.get('/analysis/career', careerAnalysis);

module.exports = router;
