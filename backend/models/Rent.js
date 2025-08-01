const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paidOn: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rent', RentSchema); 