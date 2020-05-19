const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const factoryController = require('../controllers/factoryController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.route('/verify/user/:token').patch(authController.verifyUser);

router.use(authController.protect);

router.route('/me').get(userController.getMe);

router.use(authController.userVerificationNeeded);

router.route('/myIdeas').get(userController.getMyIdeas);
router.route('/myIdeas/:id').get(userController.getMyIdea);

router
  .route('/updateMe')
  .patch(
    userController.uploadUserImages,
    userController.resizeUserImages,
    userController.updateMe
  );

router.route('/account').get(userController.checkStripeAccount);

router.route('/verify/account').patch(userController.stripeAccountVerification);

router.route('/verify/success').get(userController.accountVerifySuccess);
router.route('/verify/failed').get(userController.accountVerifyFailed);

module.exports = router;
