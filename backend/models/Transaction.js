const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    default: 'expense',
  },
  category: {
    type: String,
    default: 'General',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAutoParsed: {
    type: Boolean,
    default: false,
  },
  merchant: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);