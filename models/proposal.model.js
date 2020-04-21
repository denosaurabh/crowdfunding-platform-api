const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    minlength: [
      10,
      'Your Proposal title is too small! Make it more than 10 characters'
    ],
    maxlength: [
      400,
      'Your Proposal title is too big! Keep it within 400 characters'
    ],
    required: [true, 'Proposal title is required!'],
    trim: true
  },
  description: {
    type: String,
    minlength: [
      100,
      'Your Proposal description is too small! Make it more than 100 characters'
    ],
    maxlength: [
      3000,
      'Your Proposal description is too big! Keep it within 3000 characters'
    ],
    required: [true, 'Proposal description is required!'],
    trim: true
  },
  uploadBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }
  ],
  field: { type: String, required: [true, 'Proposal field is required!'] },
  upvotes: { type: Number, default: 0 },
  uploadedOn: { type: Date }
});

ProposalSchema.pre('save', function(next) {
  // eslint-disable-next-line new-cap
  this.uploadedOn = Date.now();

  next();
});

const Proposal = mongoose.model('Proposal', ProposalSchema);

module.exports = Proposal;
