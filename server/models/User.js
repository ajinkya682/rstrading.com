const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  rsId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  dob: { type: Date },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sponsorRsId: { type: String, default: null },
  sponsorName: { type: String, default: null },
  nomineeName: { type: String, trim: true },
  nomineeRelation: { type: String, enum: ['Spouse', 'Parent', 'Sibling', 'Child', 'Other'], default: 'Spouse' },
  address: { type: String, trim: true },
  district: { type: String, trim: true },
  taluka: { type: String, trim: true },
  bankName: { type: String, trim: true },
  accountHolder: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  branchName: { type: String, trim: true },
  ifscCode: { type: String, trim: true, uppercase: true },
  panCard: { type: String, trim: true, uppercase: true },
  isActive: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  level: { type: Number, default: 0, min: 0, max: 9 },
  activationDate: { type: Date, default: null },
  activationEPin: { type: String, default: null },
  walletBalance: { type: Number, default: 0, min: 0 },
  totalIncome: { type: Number, default: 0, min: 0 },
  directIncome: { type: Number, default: 0, min: 0 },
  referralCount: { type: Number, default: 0 },
  activeTeamCount: { type: Number, default: 0 },
  refreshToken: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  profilePhoto: { type: String, default: null },
  kycStatus: {
    pan: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    bank: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  },
}, {
  timestamps: true,
  strict: true,
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Remove sensitive fields from JSON output
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

userSchema.index({ rsId: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ email: 1 });
userSchema.index({ sponsorId: 1 });

module.exports = mongoose.model('User', userSchema);
