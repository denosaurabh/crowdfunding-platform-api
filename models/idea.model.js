const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    minlength: [
      10,
      'Your idea title is too small! Make it more than 10 characters'
    ],
    maxlength: [
      400,
      'Your Idea title is too big! Keep it within 400 characters'
    ],
    required: [true, 'Idea title is required!'],
    trim: true
  },
  description: {
    type: String,
    minlength: [
      100,
      'Your idea description is too small! Make it more than 100 characters'
    ],
    maxlength: [
      3000,
      'Your Idea description is too big! Keep it within 3000 characters'
    ],
    required: [true, 'Idea description is required!'],
    trim: true
  },
  field: { type: String, required: true },
  fundLimit: { type: Number, required: true },
  fundTiers: { type: Array, required: true },
  currentFunded: { type: Number, default: 0 },
  fundPercent: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  upvotesBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  uploadedOn: Date,
  uploadByName: String,
  uploadBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

// IdeaSchema.virtual('isUpvoted', function(userId) {
//   this.isUpvoted = this.upvotesBy.includes(userId);
// });

IdeaSchema.pre('save', function(next) {
  this.fundPercent = (this.currentFunded / this.fundLimit) * 100;
  this.uploadedOn = Date.now();
  next();
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
