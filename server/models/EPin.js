const mongoose = require('mongoose');

const ePinSchema = new mongoose.Schema({
  pin: { type: String, unique: true, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['available', 'transferred', 'used'], default: 'available' },
  usedAt: { type: Date, default: null },
  transferHistory: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
  }],
  batchId: { type: String, default: null },
  notes: { type: String, default: '' },
}, {
  timestamps: true,
  strict: true,
});

ePinSchema.index({ pin: 1 });
ePinSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('EPin', ePinSchema);
