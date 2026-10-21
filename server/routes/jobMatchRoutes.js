const express = require('express');
const router = express.Router();
const { analyzeJobMatch, getMatchHistory } = require('../controllers/jobMatchController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/analyze', analyzeJobMatch);
router.get('/history', getMatchHistory);

module.exports = router;
