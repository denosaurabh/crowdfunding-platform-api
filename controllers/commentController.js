const Comment = require('../models/comment.model');
const Proposal = require('../models/proposal.model');
const factoryController = require('./factoryController');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createComment = catchAsync(async (req, res, next) => {
  req.body.uploadBy = req.user._id;
  req.body.proposalId = req.params.id;

  const comment = await Comment.create(req.body);

  await Proposal.findByIdAndUpdate(req.params.id, {
    $push: { comments: comment._id }
  });

  res.status(201).json({
    status: 'success',
    data: comment
  });
});

exports.proposalAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ proposalId: req.params.id }).populate({
    path: 'uploadBy',
    select: '-password -email'
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: comments
  });
});
