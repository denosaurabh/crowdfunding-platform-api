const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
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
  fundLimit: Number,
  currentFunded: Number,
  fundPercent: Number,
  upvotes: Number,
  uploadBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

IdeaSchema.pre('save', function(next) {
  this.fundPercent = (this.currentFunded / this.fundLimit) * 100;
  next();
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
