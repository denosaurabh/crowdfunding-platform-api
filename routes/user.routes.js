const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const factoryController = require('../controllers/factoryController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/me', userController.getMe, factoryController.getOne);

router.patch(
  '/updateMe',
  userController.uploadUserImages,
  userController.resizeUserImages,
  userController.updateMe
);

module.exports = router;
