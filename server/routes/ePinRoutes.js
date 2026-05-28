const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate, requireAdmin } = require('../middleware/auth');
const EPin = require('../models/EPin');
const User = require('../models/User');
const { processActivationIncome, checkAndUpdateLevel } = require('../services/incomeEngine');

const generatePin = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'EP' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// POST /api/epin/activate — Activate account using E-Pin
router.post('/activate', authenticate, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ success: false, message: 'E-Pin required' });

    const epin = await EPin.findOne({ pin: pin.toUpperCase(), status: 'available' }).session(session);
    if (!epin) return res.status(400).json({ success: false, message: 'Invalid or already used E-Pin' });

    const user = await User.findById(req.user.userId).session(session);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isActive) return res.status(400).json({ success: false, message: 'Account is already active' });

    // Activate user
    user.isActive = true;
    user.activationDate = new Date();
    user.activationEPin = epin.pin;
    await user.save({ session });

    // Mark pin as used
    epin.usedBy = user._id;
    epin.status = 'used';
    epin.usedAt = new Date();
    await epin.save({ session });

    // Process income distribution
    await processActivationIncome(user._id, session);

    // Update levels for sponsor chain
    if (user.sponsorId) {
      await checkAndUpdateLevel(user.sponsorId, session);
    }

    await session.commitTransaction();
    res.json({ success: true, message: 'Account activated successfully!', activationDate: user.activationDate });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// GET /api/epin/mine — Get my E-Pins
router.get('/mine', authenticate, async (req, res, next) => {
  try {
    const pins = await EPin.find({ assignedTo: req.user.userId }).sort('-createdAt');
    res.json({ success: true, pins });
  } catch (err) {
    next(err);
  }
});

// POST /api/epin/transfer — Transfer E-Pin to another user
router.post('/transfer', authenticate, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { pin, recipientRsId } = req.body;

    const epin = await EPin.findOne({ pin, assignedTo: req.user.userId, status: 'available' }).session(session);
    if (!epin) return res.status(400).json({ success: false, message: 'Pin not found or not available for transfer' });

    const recipient = await User.findOne({ rsId: recipientRsId.toUpperCase() }).session(session);
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient RS ID not found' });

    epin.transferHistory.push({ from: req.user.userId, to: recipient._id });
    epin.assignedTo = recipient._id;
    epin.status = 'transferred';
    await epin.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: `E-Pin transferred to ${recipient.fullName} (${recipient.rsId})` });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// POST /api/epin/generate — Admin generates E-Pins
router.post('/generate', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { count = 10, notes = '' } = req.body;
    if (count < 1 || count > 1000) return res.status(400).json({ success: false, message: 'Count must be 1–1000' });

    const batchId = `BATCH-${Date.now()}`;
    const pins = [];
    const existing = new Set((await EPin.find({}, 'pin')).map(p => p.pin));

    for (let i = 0; i < count; i++) {
      let pin;
      do { pin = generatePin(); } while (existing.has(pin));
      existing.add(pin);
      pins.push({ pin, generatedBy: req.user.userId, batchId, notes });
    }

    const created = await EPin.insertMany(pins);
    res.status(201).json({ success: true, message: `${count} E-Pins generated`, count: created.length, batchId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
