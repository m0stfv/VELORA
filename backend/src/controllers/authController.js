const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Current user fetched',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user',
    });
  }
};

const normalizeAddress = (address = {}) => ({
  street: String(address.street || '').trim(),
  city: String(address.city || '').trim(),
  state: String(address.state || '').trim(),
  country: String(address.country || '').trim(),
  zipCode: String(address.zipCode || '').trim(),
  isDefault: Boolean(address.isDefault),
});

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: user?.addresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch addresses',
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const { street, city, state, country, zipCode, isDefault } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all address fields.',
      });
    }

    const user = await User.findById(req.user._id);
    const nextAddress = normalizeAddress({ street, city, state, country, zipCode, isDefault: Boolean(isDefault) });

    if (user.addresses.length === 0 || nextAddress.isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
      nextAddress.isDefault = true;
    }

    user.addresses.push(nextAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add address',
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, country, zipCode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex((address) => address._id.toString() === id);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const updatedAddress = normalizeAddress({
      street,
      city,
      state,
      country,
      zipCode,
      isDefault,
    });

    if (updatedAddress.isDefault || user.addresses.length === 1) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
      updatedAddress.isDefault = true;
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...updatedAddress,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update address',
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const originalLength = user.addresses.length;

    user.addresses = user.addresses.filter((address) => address._id.toString() !== id);

    if (user.addresses.length !== originalLength && user.addresses.length > 0 && !user.addresses.some((address) => address.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete address',
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    user.addresses = user.addresses.map((address) => ({
      ...address.toObject(),
      isDefault: address._id.toString() === id,
    }));

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update default address',
    });
  }
};

// Request password reset - sends an email with a reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always respond with success to avoid leaking which emails are registered
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    try {
      await sendResetPasswordEmail(user.email, resetUrl);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process request',
    });
  }
};

// Reset password using the token from the email link
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password',
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  forgotPassword,
  resetPassword,
};
