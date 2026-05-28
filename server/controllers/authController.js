const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateRsId = async () => {
  let rsId, exists;
  do {
    const num = Math.floor(1000 + Math.random() * 9000);
    rsId = `RS${num}`;
    exists = await User.findOne({ rsId });
  } while (exists);
  return rsId;
};

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const {
      sponsorRsId, fullName, mobile, email, password, dob,
      nomineeName, nomineeRelation, address, district, taluka,
      bankName, accountHolder, accountNumber, branchName, ifscCode, panCard,
    } = req.body;

    // Validation
    if (!sponsorRsId || !fullName || !mobile || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    // Check existing
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) return res.status(400).json({ success: false, message: 'Mobile number already registered' });

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Validate sponsor
    const sponsor = await User.findOne({ rsId: sponsorRsId.toUpperCase() });
    if (!sponsor) return res.status(400).json({ success: false, message: 'Invalid Sponsor ID. Please verify with your sponsor.' });

    // Generate RS ID
    const rsId = await generateRsId();

    const user = new User({
      rsId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // will be hashed by pre-save hook
      dob: dob ? new Date(dob) : undefined,
      sponsorId: sponsor._id,
      sponsorRsId: sponsor.rsId,
      sponsorName: sponsor.fullName,
      nomineeName, nomineeRelation, address, district, taluka,
      bankName, accountHolder, accountNumber, branchName, ifscCode, panCard,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your RS Trading ID has been created.',
      rsId: user.rsId,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required' });
    }

    // Find user by rsId, email, or mobile
    const query = identifier.startsWith('RS')
      ? { rsId: identifier.toUpperCase() }
      : identifier.includes('@')
        ? { email: identifier.toLowerCase() }
        : { mobile: identifier };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact support.' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user._id, user.role);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, accessToken, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/validate-sponsor
exports.validateSponsor = async (req, res, next) => {
  try {
    const { sponsorId } = req.body;
    if (!sponsorId) return res.status(400).json({ success: false, message: 'Sponsor ID required' });

    const sponsor = await User.findOne({ rsId: sponsorId.toUpperCase() });
    if (!sponsor) return res.status(404).json({ success: false, message: 'Invalid Sponsor ID' });

    res.json({
      success: true,
      sponsor: { rsId: sponsor.rsId, fullName: sponsor.fullName, isActive: sponsor.isActive },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const query = identifier.includes('@') ? { email: identifier.toLowerCase() } : { mobile: identifier };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email/mobile' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await require('bcryptjs').hash(otp, 10);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    // In production: send OTP via SMS/email
    console.log(`OTP for ${user.rsId}: ${otp}`);

    res.json({ success: true, message: `OTP sent to your registered ${identifier.includes('@') ? 'email' : 'mobile number'}` });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    const query = identifier.includes('@') ? { email: identifier.toLowerCase() } : { mobile: identifier };
    const user = await User.findOne(query);

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    const valid = await require('bcryptjs').compare(otp, user.otp);
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    user.passwordHash = newPassword; // will be hashed by pre-save
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
