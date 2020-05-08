const express = require('express');

const authController = require('../controllers/authController');
const universityController = require('../controllers/universityController');

const router = express.Router();

router
  .route('/')
  .get(universityController.getAlluniversities)
  .post(
    authController.protect,
    universityController.uploadUniversityImage,
    universityController.resizeUniversityImage,
    universityController.createUniversity
  );

router
  .route('/myUniversity')
  .get(authController.protect, universityController.myUniversity);

router.route('/:id').get(universityController.getuniversity);

router
  .route('/:id/member/:memberId/remove')
  .post(authController.protect, universityController.removeMember);

router
  .route('/:id/invite')
  .get(authController.protect, universityController.redeemInvitation)
  .post(authController.protect, universityController.inviteMember);

module.exports = router;
