const mongoose = require('mongoose');
const User = require('../models/User');
const EPin = require('../models/EPin');
const Transaction = require('../models/Transaction');

// Income amounts per level as per business plan
const INCOME_TABLE = {
  direct: 1500,
  1: 1500,
  2: 5000,
  3: 7000,
  4: 10000,
  5: 15000,
  6: 20000,
  7: 30000,
  8: 50000,
  9: 75000,
};

const LEVEL_THRESHOLD = {
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
};

const generateTxId = () => `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

/**
 * Process income distribution when a new user is activated.
 * Traverses the sponsor chain and credits income to eligible sponsors.
 */
exports.processActivationIncome = async (newUserId, session) => {
  const newUser = await User.findById(newUserId).session(session);
  if (!newUser || !newUser.isActive) return;

  // 1. Direct income for sponsor
  if (newUser.sponsorId) {
    const sponsor = await User.findById(newUser.sponsorId).session(session);
    if (sponsor && sponsor.isActive) {
      sponsor.walletBalance += INCOME_TABLE.direct;
      sponsor.totalIncome += INCOME_TABLE.direct;
      sponsor.directIncome += INCOME_TABLE.direct;
      sponsor.referralCount += 1;

      const txn = new Transaction({
        transactionId: generateTxId(),
        userId: sponsor._id,
        type: 'credit',
        category: 'direct_income',
        amount: INCOME_TABLE.direct,
        description: `Direct Income from ${newUser.fullName} (${newUser.rsId})`,
        balanceAfter: sponsor.walletBalance,
        fromUserId: newUser._id,
      });

      await txn.save({ session });
      await sponsor.save({ session });
    }
  }

  // 2. Level income — walk up the sponsor chain
  let current = newUser;
  for (let depth = 1; depth <= 9; depth++) {
    if (!current.sponsorId) break;

    const ancestor = await User.findById(current.sponsorId).session(session);
    if (!ancestor) break;

    // Check if ancestor is eligible for this level income
    if (ancestor.isActive && ancestor.level >= depth) {
      const incomeAmount = INCOME_TABLE[depth];

      ancestor.walletBalance += incomeAmount;
      ancestor.totalIncome += incomeAmount;

      const txn = new Transaction({
        transactionId: generateTxId(),
        userId: ancestor._id,
        type: 'credit',
        category: 'level_income',
        amount: incomeAmount,
        description: `Level ${depth} Income — Team Growth`,
        balanceAfter: ancestor.walletBalance,
        level: depth,
        fromUserId: newUser._id,
      });

      await txn.save({ session });
      await ancestor.save({ session });
    }

    current = ancestor;
  }
};

/**
 * Check and update user levels based on active team size.
 */
exports.checkAndUpdateLevel = async (userId, session) => {
  const user = await User.findById(userId).session(session);
  if (!user || !user.isActive) return;

  // Count active referrals at each level (BFS)
  let currentLevel = 0;
  let queue = [userId];

  for (let lvl = 1; lvl <= 9; lvl++) {
    if (queue.length === 0) break;

    const children = await User.find({ sponsorId: { $in: queue }, isActive: true }, '_id').session(session);
    if (children.length >= LEVEL_THRESHOLD[lvl]) {
      currentLevel = lvl;
      queue = children.map(c => c._id);
    } else {
      break;
    }
  }

  if (currentLevel > user.level) {
    user.level = currentLevel;
    await user.save({ session });
  }
};
