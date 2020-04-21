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

router.route('/:id').get(universityController.getuniversity);

module.exports = router;
