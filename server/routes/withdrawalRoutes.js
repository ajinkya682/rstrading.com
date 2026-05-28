const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/auth');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const generateWithdrawalId = () => `WD${Date.now()}`;

// POST /api/withdrawals/request
router.post('/request', authenticate, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount } = req.body;
    if (!amount || amount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹500' });
    }

    const user = await User.findById(req.user.userId).session(session);
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account not activated' });
    if (user.walletBalance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    // Debit wallet immediately
    user.walletBalance -= amount;
    await user.save({ session });

    const withdrawal = new Withdrawal({
      withdrawalId: generateWithdrawalId(),
      userId: user._id,
      amount,
      bankName: user.bankName,
      accountHolder: user.accountHolder,
      accountNumber: user.accountNumber,
      ifscCode: user.ifscCode,
    });

    await withdrawal.save({ session });

    const txn = new Transaction({
      transactionId: `TXN${Date.now()}`,
      userId: user._id,
      type: 'debit',
      category: 'withdrawal',
      amount,
      description: `Withdrawal Request — ${withdrawal.withdrawalId}`,
      balanceAfter: user.walletBalance,
      referenceId: withdrawal.withdrawalId,
    });

    await txn.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, message: 'Withdrawal request submitted. Processing within 2-3 business days.', withdrawalId: withdrawal.withdrawalId });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// GET /api/withdrawals/my
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const withdrawals = await Withdrawal.find({ userId: req.user.userId })
      .sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Withdrawal.countDocuments({ userId: req.user.userId });
    res.json({ success: true, withdrawals, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
