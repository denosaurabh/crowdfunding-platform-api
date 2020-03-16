const express = require('express');

const ideaController = require('../controllers/ideaController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(ideaController.getAllIdeas)
  .post(authController.protect, ideaController.createIdea);

router.route('/myIdeas').get(authController.protect, ideaController.myIdeas);

router.route('/:id').get(ideaController.getIdeaOne);

module.exports = router;
