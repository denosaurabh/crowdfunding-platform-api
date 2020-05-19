const express = require('express');

const proposalController = require('../controllers/proposalController');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.userVerificationNeeded,
    proposalController.createProposal
  );

router.route('/:id').get(proposalController.getProposal);

router
  .route('/:id/comment')
  .get(commentController.proposalAllComments)
  .post(authController.protect, commentController.createComment);

router.use(authController.protect);

router.route('/:id/upvote').post(proposalController.proposalUpvote);

router.use(authController.userVerificationNeeded);

router.route('/:id/accept').post(proposalController.acceptProposal);
router.route('/:id/decline').post(proposalController.declineProposal);
router.route('/:id/archive').post(proposalController.archiveProposal);
router.route('/:id/sendEmail').post(proposalController.sendEmailToUser);

module.exports = router;
