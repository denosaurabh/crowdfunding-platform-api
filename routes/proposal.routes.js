const express = require('express');

const proposalController = require('../controllers/proposalController');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, proposalController.createProposal);

router.route('/:id').get(proposalController.getProposal);
router
  .route('/:id/comment')
  .get(commentController.proposalAllComments)
  .post(authController.protect, commentController.createComment);

router
  .route('/:id/upvote')
  .post(authController.protect, proposalController.proposalUpvote);

module.exports = router;
