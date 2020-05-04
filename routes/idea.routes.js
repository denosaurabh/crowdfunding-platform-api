const express = require('express');

const ideaController = require('../controllers/ideaController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(ideaController.getAllIdeas)
  .post(authController.protect, ideaController.createIdea);

router.route('/myIdeas').get(authController.protect, ideaController.myIdeas);

router
  .route('/:id')
  .get(ideaController.getIdeaOne)
  .post(authController.protect, ideaController.ideaFunc);

router
  .route('/:id/support')
  .post(authController.protect, ideaController.postIdeaPaymentIntent);

module.exports = router;
