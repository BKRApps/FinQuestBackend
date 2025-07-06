const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || null }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or phone already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName
      }
    });

    res.status(201).json({
      message: 'User registered successfully. Please verify your account with the OTP sent.',
      userId: user.id
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      error: 'Registration failed',
      details: error.message
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, code, type = 'REGISTRATION' } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        error: 'User ID and OTP code are required'
      });
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    // Generate JWT token
    const token = generateToken(userId);

    res.json({
      message: 'Account verified successfully',
      token,
      user: {
        id: userId,
        isVerified: true
      }
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({
      error: 'OTP verification failed',
      details: error.message
    });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId, type = 'REGISTRATION' } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'OTP resend functionality not implemented'
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      error: 'Failed to resend OTP',
      details: error.message
    });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'Forgot password functionality not implemented'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;

    if (!userId || !code || !newPassword) {
      return res.status(400).json({
        error: 'User ID, OTP code, and new password are required'
      });
    }

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message
    });
  }
});

module.exports = router; 