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

router
  .route('/:id/accept')
  .post(authController.protect, proposalController.acceptProposal);

router
  .route('/:id/decline')
  .post(authController.protect, proposalController.declineProposal);

router
  .route('/:id/archive')
  .post(authController.protect, proposalController.archiveProposal);

router
  .route('/:id/sendEmail')
  .post(authController.protect, proposalController.sendEmailToUser);

module.exports = router;
