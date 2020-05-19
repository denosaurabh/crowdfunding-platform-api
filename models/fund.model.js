const mongoose = require('mongoose');

const FundSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  img: { type: String, required: true },
  job: { type: String, required: true },
  ideaId: { type: mongoose.Schema.ObjectId, ref: 'Idea' },
  thanked: { type: Boolean, default: false, select: true },
  supportedOn: { type: Date }
});

FundSchema.pre('save', function(next) {
  this.supportedOn = Date.now();

  next();
});

// FundSchema.index({ fundedOn: 1 });

const Fund = mongoose.model('Fund', FundSchema);

module.exports = Fund;
