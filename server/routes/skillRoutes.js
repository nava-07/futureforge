const express = require('express');
const router = express.Router();
const { getSkills, addSkills, analyzeSkills } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSkills);
router.post('/', addSkills);
router.post('/analyze', analyzeSkills);

module.exports = router;
