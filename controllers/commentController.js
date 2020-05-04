const Comment = require('../models/comment.model');
const Proposal = require('../models/proposal.model');
const factoryController = require('./factoryController');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createComment = catchAsync(async (req, res, next) => {
  req.body.uploadBy = req.user._id;
  req.body.proposalId = req.params.id;
  req.body.byUser = req.user.name;
  req.body.byUserJob = req.user.job;
  req.body.imageCover = req.user.imageCover;

  const comment = await Comment.create(req.body);

  await Proposal.findByIdAndUpdate(req.params.id, {
    $push: { comments: { $each: [comment._id], $position: 0 } }
  });

  res.status(201).json({
    status: 'success',
    data: comment
  });
});

exports.proposalAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ proposalId: req.params.id }).populate({
    path: 'uploadBy',
    select: '-password -email -accountId'
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: comments
  });
});
