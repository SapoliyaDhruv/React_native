const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ExamResult = require('../models/ExamResult');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, grade, board, medium } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      const chosenGrade = grade || 'college';
      const chosenStage = chosenGrade === 'college' ? 'college' : 'school';
      const effectiveBoard = chosenGrade === 'college' ? 'CBSE' : 'GSEB';
      const effectiveMedium = chosenGrade === 'college' ? 'English' : 'Gujarati';

      const token = jwt.sign(
        { userId: 'off_' + Date.now(), email },
        process.env.JWT_SECRET || 'mindsprint_secret',
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        message: 'User registered in local session',
        token,
        user: {
          id: 'usr_' + Date.now(),
          name,
          email,
          activeTrack: chosenStage === 'college' ? 'placement' : 'school',
          grade: chosenGrade,
          board: effectiveBoard,
          medium: effectiveMedium,
          academicStage: chosenStage,
          streakCount: 1,
          avatarUrl: '',
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const chosenGrade = grade || 'college';
    const chosenStage = chosenGrade === 'college' ? 'college' : 'school';
    const effectiveBoard = chosenGrade === 'college' ? 'CBSE' : 'GSEB';
    const effectiveMedium = chosenGrade === 'college' ? 'English' : 'Gujarati';

    const user = new User({
      name,
      email,
      passwordHash,
      grade: chosenGrade,
      board: effectiveBoard,
      medium: effectiveMedium,
      academicStage: chosenStage,
      activeTrack: chosenStage === 'college' ? 'placement' : 'school',
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'mindsprint_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        activeTrack: user.activeTrack,
        grade: user.grade,
        board: user.board,
        medium: user.medium,
        academicStage: user.academicStage,
        streakCount: user.streakCount,
        avatarUrl: user.avatarUrl || '',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState !== 1) {
      const token = jwt.sign(
        { userId: 'off_' + Date.now(), email },
        process.env.JWT_SECRET || 'mindsprint_secret',
        { expiresIn: '7d' }
      );
      return res.json({
        message: 'Login successful (offline session)',
        token,
        user: {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0],
          email,
          activeTrack: 'placement',
          grade: 'college',
          board: 'CBSE',
          medium: 'English',
          academicStage: 'college',
          streakCount: 1,
          targetCompany: 'All Companies',
          avatarUrl: '',
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'mindsprint_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        activeTrack: user.activeTrack,
        grade: user.grade || 'college',
        board: user.board || 'CBSE',
        medium: user.medium || 'English',
        academicStage: user.academicStage || 'college',
        streakCount: user.streakCount,
        targetCompany: user.targetCompany,
        avatarUrl: user.avatarUrl || '',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/profile - Update full profile info
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;
    const { name, targetCompany, college, bio, avatarUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (targetCompany) updateFields.targetCompany = targetCompany;
    if (college) updateFields.college = college;
    if (bio) updateFields.bio = bio;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        grade: updatedUser.grade,
        board: updatedUser.board,
        medium: updatedUser.medium,
        streakCount: updatedUser.streakCount,
        targetCompany: updatedUser.targetCompany,
        avatarUrl: updatedUser.avatarUrl || '',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/auth/account - Apple App Store & Google Play Data Compliance
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;
    if (!email) {
      return res.status(400).json({ error: 'User email is required for account deletion' });
    }

    await User.deleteOne({ email });
    await ExamResult.deleteMany({ userEmail: email });

    res.json({
      success: true,
      message: 'Account and associated study records have been permanently deleted in compliance with privacy regulations.',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/academic-profile - Update grade, board, and medium
router.put('/academic-profile', authenticateToken, async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;
    const { grade, board, medium } = req.body;
    if (!email || !grade) {
      return res.status(400).json({ error: 'Email and grade are required' });
    }

    const chosenStage = grade === 'college' ? 'college' : 'school';
    const effectiveBoard = grade === 'college' ? 'CBSE' : 'GSEB';
    const effectiveMedium = grade === 'college' ? 'English' : 'Gujarati';

    const user = await User.findOneAndUpdate(
      { email },
      {
        grade,
        board: effectiveBoard,
        medium: effectiveMedium,
        academicStage: chosenStage,
        activeTrack: chosenStage === 'college' ? 'placement' : 'school',
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      success: true,
      message: 'Academic profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        activeTrack: user.activeTrack,
        grade: user.grade,
        board: user.board,
        medium: user.medium,
        academicStage: user.academicStage,
      },
    });
  } catch (error) {
    console.error('Error updating academic profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Google Sign-In Authentication Endpoint
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID Token is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID_WEB,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google ID token verification failed:', verifyError.message);
      return res.status(400).json({ error: 'Invalid Google ID Token: ' + verifyError.message });
    }

    const { email, name } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Google account does not provide an email address' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name || 'Google User',
        email,
        passwordHash: 'OAuthAccount_NoPasswordHash_' + Math.random().toString(36).substring(2),
        grade: 'college',
        board: 'CBSE',
        medium: 'English',
        academicStage: 'college',
        activeTrack: 'placement',
        streakCount: 1,
        targetCompany: 'All Companies',
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'mindsprint_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        activeTrack: user.activeTrack,
        grade: user.grade || 'college',
        board: user.board || 'CBSE',
        medium: user.medium || 'English',
        academicStage: user.academicStage || 'college',
        streakCount: user.streakCount,
        targetCompany: user.targetCompany,
      },
    });
  } catch (error) {
    console.error('Google Auth Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
