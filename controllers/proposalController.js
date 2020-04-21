const Proposal = require('../models/proposal.model');
const University = require('../models/university.model');

const factoryController = require('./factoryController');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createProposal = catchAsync(async (req, res, next) => {
  req.body.upvotes = 0;
  req.body.uploadBy = req.user._id;

  if (!req.body.university) {
    return next(new AppError('Please provite ID of the University', 400));
  }

  const proposal = await Proposal.create(req.body);

  await University.findByIdAndUpdate(req.body.university, {
    $push: { proposals: proposal._id }
  });

  res.status(201).json({
    status: 'success',
    data: proposal
  });
});

exports.getProposal = factoryController.getOne(
  Proposal,
  { path: 'uploadBy' },
  { path: 'comments' }
);
exports.allProposals = factoryController.getAll(Proposal);
