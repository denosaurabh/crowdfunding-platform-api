const express = require('express');

const fundController = require('../controllers/fundController');

const router = express.Router();

router.route('/:id').get(fundController.getAllIdeaFunds);

module.exports = router;
