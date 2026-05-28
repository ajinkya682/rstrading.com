const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// GET /api/user/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const allowed = ['fullName', 'email', 'address', 'district', 'taluka', 'nomineeName', 'nomineeRelation', 'dob'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true });
    res.json({ success: true, user: user.toSafeObject(), message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/bank-details
router.put('/bank-details', authenticate, async (req, res, next) => {
  try {
    const { bankName, accountHolder, branchName, ifscCode, panCard } = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, { bankName, accountHolder, branchName, ifscCode, panCard }, { new: true });
    res.json({ success: true, user: user.toSafeObject(), message: 'Bank details updated' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/change-password
router.put('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.passwordHash = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/user/team
router.get('/team', authenticate, async (req, res, next) => {
  try {
    const { level = 1, page = 1, limit = 20 } = req.query;
    // Get all downline users at the specified level depth
    let queue = [req.user.userId];
    for (let d = 0; d < parseInt(level) - 1; d++) {
      const children = await User.find({ sponsorId: { $in: queue } }, '_id');
      queue = children.map(c => c._id.toString());
      if (!queue.length) break;
    }
    const members = await User.find({ sponsorId: { $in: queue } }, 'rsId fullName mobile sponsorRsId isActive level createdAt')
      .skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments({ sponsorId: { $in: queue } });
    res.json({ success: true, members, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/user/dashboard-stats
router.get('/dashboard-stats', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    const allDownline = await User.find({ sponsorRsId: { $regex: new RegExp(`^${user.rsId}`) } }).count();
    res.json({
      success: true,
      stats: {
        walletBalance: user.walletBalance,
        totalIncome: user.totalIncome,
        directIncome: user.directIncome,
        level: user.level,
        referralCount: user.referralCount,
        totalTeam: allDownline,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
