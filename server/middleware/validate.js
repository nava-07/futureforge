const { check, validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError, errors: errors.array() });
  }
  next();
};

const validateRegister = [
  check('name', 'Full Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
  check('college', 'College/University is required').notEmpty(),
  check('department', 'Department is required').notEmpty(),
  validationHandler
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validationHandler
];

const validateProfile = [
  check('personalInfo.phone', 'Phone number is required').optional().notEmpty(),
  check('academic.degree', 'Degree is required').optional().notEmpty(),
  validationHandler
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfile,
  validationHandler
};
