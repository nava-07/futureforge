const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, validationHandler } = require('../middleware/validate');

router.post('/register', validateRegister, validationHandler, register);
router.post('/login', validateLogin, validationHandler, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
