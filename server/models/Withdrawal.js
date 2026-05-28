const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  withdrawalId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 500 },
  bankName: { type: String, required: true },
  accountHolder: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true, uppercase: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  processedAt: { type: Date, default: null },
  transactionRef: { type: String, default: null },
  transactionDate: { type: Date, default: null },
  rejectionReason: { type: String, default: null },
  notes: { type: String, default: '' },
}, {
  timestamps: true,
  strict: true,
});

withdrawalSchema.index({ userId: 1, status: 1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
