const express = require('express');
const router = express.Router();
const { createOrUpdatePortfolio, getPortfolio, getMyPortfolio, deletePortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrUpdatePortfolio);
router.get('/me', protect, getMyPortfolio);
router.delete('/', protect, deletePortfolio);
router.get('/:username', getPortfolio);

module.exports = router;
