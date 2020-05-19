const Fund = require('../models/fund.model');

const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

exports.getAllIdeaFunds = catchAsync(async (req, res, next) => {
  const allIdeaFunds = await Fund.find({ ideaId: req.params.id }).sort({
    fundedOn: 1
  });

  res.status(200).json({
    status: 'success',
    data: allIdeaFunds
  });
});

exports.sendThanksEmail = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const fund = await Fund.findById(id);

  if (process.env.NODE_ENV === 'production' && !fund.thanked) {
    await new Email({ email: fund.email }).sendThanksToFundiser(req.user.name);

    await Fund.findByIdAndUpdate(id, { thanked: true });

    res.status(200).json({
      status: 'success',
      message: 'A Thanks Email has been send!'
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'You have already sended a Thanks email to this User!'
    });
  }
});
