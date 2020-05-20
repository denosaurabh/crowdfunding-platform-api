const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  description: {
    type: String,
    maxlength: [
      2000,
      'Your Comment Description is too big! Keep it within 2000 characters'
    ],
    required: [true, 'Comment Description is required!'],
    trim: true
  },
  uploadBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  byUser: String,
  byUserJob: String,
  byUserImg: String,
  proposalId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Proposal'
  },
  uploadedOn: { type: Date }
});

CommentSchema.pre('save', function(next) {
  // eslint-disable-next-line new-cap
  this.uploadedOn = Date.now();

  next();
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
