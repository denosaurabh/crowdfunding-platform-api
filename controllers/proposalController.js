const Proposal = require('../models/proposal.model');
const University = require('../models/university.model');

const factoryController = require('./factoryController');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

exports.createProposal = catchAsync(async (req, res, next) => {
  req.body.upvotes = 0;
  req.body.accepted = false;
  req.body.uploadBy = req.user._id;

  if (!req.body.university) {
    return next(new AppError('Please provite ID of the University', 400));
  }

  const proposal = await Proposal.create(req.body);

  await University.findByIdAndUpdate(req.body.university, {
    $push: { proposals: { $each: [proposal._id], $position: 0 } }
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

exports.proposalUpvote = catchAsync(async (req, res, next) => {
  const proposalId = req.params.id;
  console.log(req.user.name);

  const isAlreadyUpvoted = await Proposal.findOne({
    _id: proposalId,
    upvotesBy: req.user._id
  });

  if (isAlreadyUpvoted) {
    return next(new AppError('Already Upvoted!', 200)); // Hack, to avoid Problems
  }

  const updatedDoc = await Proposal.findByIdAndUpdate(proposalId, {
    $inc: { upvotes: 1 },
    $push: { upvotesBy: req.user._id }
  });

  res.status(200).json({
    status: 'success',
    data: {
      proposal: updatedDoc
    }
  });
});

exports.acceptProposal = catchAsync(async (req, res, next) => {
  const proposalId = req.params.id;
  const { universityId } = req.body;

  if (!proposalId || !universityId) {
    return next(
      new AppError('Please provide corrent Proposal and University Id', 400)
    );
  }

  const university = await University.findOne({
    _id: universityId,
    admin: req.user._id,
    proposals: proposalId
  });

  if (!university) {
    return next(new AppError('No correct university found!', 403));
  }

  const updatedProposal = await Proposal.findByIdAndUpdate(proposalId, {
    accepted: true
  });

  res.status(200).json({
    status: 'success',
    message: 'The Proposal has been sucessfully Accepted!',
    data: { proposal: updatedProposal }
  });
});

exports.declineProposal = catchAsync(async (req, res, next) => {
  const proposalId = req.params.id;

  const { universityId } = req.body;

  if (!proposalId || !universityId) {
    return next(
      new AppError('Please provide current Proposal and University Id', 400)
    );
  }

  const university = await University.findById(universityId);

  if (!university) {
    return next(new AppError('No correct university found!', 403));
  }

  const updatedUniversity = await University.findOneAndUpdate({
    _id: universityId,
    admin: req.user._id,
    $pull: { proposals: proposalId }
  });

  await Proposal.findByIdAndDelete(proposalId);

  res.status(200).json({
    status: 'success',
    message: 'The Proposal has been Declined!',
    data: updatedUniversity
  });
});

exports.archiveProposal = catchAsync(async (req, res, next) => {
  const { universityId } = req.body;
  const { id: proposalId } = req.params;

  if (!proposalId || !universityId) {
    return next(
      new AppError('Please provide current Proposal and University Id', 400)
    );
  }

  const updatedUniversity = await University.findByIdAndUpdate(universityId, {
    $pull: { proposals: proposalId }
  });

  res.status(200).json({
    status: 'success',
    message: 'Proposal has been Archived!',
    data: updatedUniversity
  });
});

exports.sendEmailToUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  const proposal = await Proposal.findById(id).populate({
    path: 'uploadBy'
  });

  console.log(proposal);

  if (process.env.NODE_ENV === 'production') {
    await new Email(proposal.uploadBy).sendEmailToUser(message);
  }

  res.status(200).json({
    status: 'success',
    message: 'The Email has send to User!'
  });
});

exports.allProposals = factoryController.getAll(Proposal);
