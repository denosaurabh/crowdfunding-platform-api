const mongoose = require('mongoose');

const FundSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  img: { type: String, required: true },
  job: { type: String, required: true },
  ideaId: { type: mongoose.Schema.ObjectId, ref: 'Idea' }
});

const Fund = mongoose.model('Fund', FundSchema);

module.exports = Fund;
