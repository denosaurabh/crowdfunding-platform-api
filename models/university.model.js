const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [
      400,
      'Your University Name is too big! Keep it within 400 characters'
    ],
    required: [true, 'University Name is required!'],
    trim: true
  },
  description: {
    type: String,
    minlength: [
      100,
      'Your University description is too small! Make it more than 100 characters'
    ],
    maxlength: [
      3000,
      'Your University description is too big! Keep it within 3000 characters'
    ],
    required: [true, 'University description is required!'],
    trim: true
  },
  field: {
    type: String,
    required: [true, 'University Field is required!']
  },
  proposals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Proposal'
    }
  ],
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  invites: [
    {
      type: String
    }
  ],
  image: String,
  formedOn: Date
});

UniversitySchema.pre('save', function(next) {
  // eslint-disable-next-line new-cap
  this.formedOn = Date.now();

  next();
});

const University = mongoose.model('University', UniversitySchema);

module.exports = University;
