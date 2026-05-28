const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// GET /api/wallet/balance
router.get('/balance', authenticate, async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId, 'walletBalance totalIncome directIncome');
    res.json({ success: true, walletBalance: user.walletBalance, totalIncome: user.totalIncome, directIncome: user.directIncome });
  } catch (err) {
    next(err);
  }
});

// GET /api/wallet/transactions
router.get('/transactions', authenticate, async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20, from, to } = req.query;
    const query = { userId: req.user.userId };
    if (type) query.type = type;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({ success: true, transactions, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
