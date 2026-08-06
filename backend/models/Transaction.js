const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    default: 'Transaction',
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

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);