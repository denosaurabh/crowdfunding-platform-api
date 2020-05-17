const Fund = require('../models/fund.model');

const catchAsync = require('../utils/catchAsync');

exports.getAllIdeaFunds = catchAsync(async (req, res, next) => {
  const allIdeaFunds = await Fund.find({ ideaId: req.params.id });

  res.status(200).json({
    status: 'success',
    data: allIdeaFunds
  });
});
