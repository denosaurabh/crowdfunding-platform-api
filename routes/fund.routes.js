const express = require('express');

const fundController = require('../controllers/fundController');
const authController = require('../controllers/authController');

const router = express.Router();

// Here id is IdeaId
router
  .route('/:id')
  .get(
    authController.protect,
    fundController.getAllIdeaFunds
  );

// Here id is FundId
router
  .route('/:id/thanks')
  .post(
    authController.protect,
    authController.userVerificationNeeded,
    fundController.sendThanksEmail
  );

module.exports = router;
