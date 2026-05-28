const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/validate-sponsor', authController.validateSponsor);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
