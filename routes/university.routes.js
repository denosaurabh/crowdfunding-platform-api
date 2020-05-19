const express = require('express');

const authController = require('../controllers/authController');
const universityController = require('../controllers/universityController');

const router = express.Router();

router
  .route('/')
  .get(universityController.getAlluniversities)
  .post(
    authController.protect,
    authController.userVerificationNeeded,
    universityController.uploadUniversityImage,
    universityController.resizeUniversityImage,
    universityController.createUniversity
  );

router
  .route('/myUniversity')
  .get(authController.protect, universityController.myUniversity);

router.route('/:id').get(universityController.getuniversity);

router.use(authController.protect, authController.userVerificationNeeded);

router
  .route('/:id/member/:memberId/remove')
  .post(universityController.removeMember);

router
  .route('/:id/invite')
  .get(universityController.redeemInvitation)
  .post(universityController.inviteMember);

module.exports = router;
