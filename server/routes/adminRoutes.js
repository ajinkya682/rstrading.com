const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const EPin = require('../models/EPin');
const mongoose = require('mongoose');

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, blockedUsers, pendingWithdrawals] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'user', isBlocked: true }),
      Withdrawal.find({ status: 'pending' }),
    ]);

    const pendingAmount = pendingWithdrawals.reduce((s, w) => s + w.amount, 0);

    // Today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegs = await User.countDocuments({ role: 'user', createdAt: { $gte: today } });

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, blockedUsers, pendingWithdrawals: pendingWithdrawals.length, pendingAmount, todayRegs },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = { role: 'user' };
    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;
    else if (status === 'blocked') query.isBlocked = true;
    if (search) {
      query.$or = [
        { rsId: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query, '-passwordHash -refreshToken -otp -otpExpiry').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:userId/block
router.put('/users/:userId/block', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isBlocked: true }, { new: true });
    res.json({ success: true, message: `${user.fullName} blocked`, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:userId/unblock
router.put('/users/:userId/unblock', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isBlocked: false }, { new: true });
    res.json({ success: true, message: `${user.fullName} unblocked`, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/withdrawals
router.get('/withdrawals', async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const [withdrawals, total] = await Promise.all([
      Withdrawal.find({ status }).populate('userId', 'fullName rsId mobile').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit)),
      Withdrawal.countDocuments({ status }),
    ]);
    res.json({ success: true, withdrawals, total });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/withdrawals/:id/approve
router.put('/withdrawals/:id/approve', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { transactionRef, transactionDate } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id).session(session);
    if (!withdrawal || withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal not found or already processed' });
    }

    withdrawal.status = 'approved';
    withdrawal.processedBy = req.user.userId;
    withdrawal.processedAt = new Date();
    withdrawal.transactionRef = transactionRef;
    withdrawal.transactionDate = transactionDate ? new Date(transactionDate) : new Date();
    await withdrawal.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: 'Withdrawal approved successfully' });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// PUT /api/admin/withdrawals/:id/reject
router.put('/withdrawals/:id/reject', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reason } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id).session(session);
    if (!withdrawal || withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal not found or already processed' });
    }

    // Refund wallet
    await User.findByIdAndUpdate(withdrawal.userId, { $inc: { walletBalance: withdrawal.amount } }, { session });

    // Refund transaction
    const user = await User.findById(withdrawal.userId).session(session);
    const txn = new Transaction({
      transactionId: `TXN${Date.now()}`,
      userId: withdrawal.userId,
      type: 'credit',
      category: 'refund',
      amount: withdrawal.amount,
      description: `Withdrawal Refund — ${withdrawal.withdrawalId}: ${reason}`,
      balanceAfter: (user?.walletBalance || 0) + withdrawal.amount,
      referenceId: withdrawal.withdrawalId,
    });
    await txn.save({ session });

    withdrawal.status = 'rejected';
    withdrawal.processedBy = req.user.userId;
    withdrawal.processedAt = new Date();
    withdrawal.rejectionReason = reason;
    await withdrawal.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: 'Withdrawal rejected and amount refunded' });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// POST /api/admin/income/manual — Add manual income
router.post('/income/manual', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { rsId, amount, type, description } = req.body;
    const user = await User.findOne({ rsId: rsId.toUpperCase() }).session(session);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.walletBalance += amount;
    user.totalIncome += amount;
    await user.save({ session });

    const txn = new Transaction({
      transactionId: `TXN${Date.now()}`,
      userId: user._id,
      type: 'credit',
      category: 'bonus',
      amount,
      description: description || `Manual ${type} Income — Admin`,
      balanceAfter: user.walletBalance,
    });
    await txn.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: `₹${amount} credited to ${user.fullName}` });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// GET /api/admin/reports/overview
router.get('/reports/overview', async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { role: 'user' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ];
    const monthlyRegs = await User.aggregate(pipeline);
    const totalIncomePipeline = [
      { $match: { type: 'credit', category: { $ne: 'refund' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ];
    const [incomeResult] = await Transaction.aggregate(totalIncomePipeline);
    res.json({ success: true, monthlyRegs, totalIncome: incomeResult?.total || 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
