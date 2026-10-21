const express = require('express');
const router = express.Router();
const { getRecommendedProjects, getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/recommended', getRecommendedProjects);
router.get('/', getProjects);

module.exports = router;
