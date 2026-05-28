const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  category: {
    type: String,
    enum: ['direct_income', 'level_income', 'withdrawal', 'activation', 'bonus', 'transfer', 'refund'],
    required: true,
  },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  balanceAfter: { type: Number, required: true },
  referenceId: { type: String, default: null },
  level: { type: Number, default: null },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
  timestamps: true,
  strict: true,
});

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
