const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { sendVerificationEmail } = require('../utils/emailSender');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'premium_pen_secret', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let profilePicture = '/images/default-avatar.png';
    if (req.file) {
      profilePicture = '/images/uploads/' + req.file.filename;
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture,
      status: 'pending_verification',
      verificationToken
    });

    if (user) {
      await sendVerificationEmail(user.email, verificationToken, user.firstName, user.lastName);

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Invalid verification link.');
    }

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).send('Invalid or expired verification link.');
    }

    user.status = 'active';
    user.verificationToken = null;
    await user.save();

    res.redirect('/verification-success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (await bcrypt.compare(password, user.password)) {
      if (user.status === 'deactivated') {
        return res.status(403).json({ error: 'Your account has been deactivated.' });
      }
      if (user.status === 'pending_verification') {
        return res.status(403).json({ error: 'Please verify your email address before logging in.' });
      }

      const token = generateToken(user.id);
      user.token = token;
      await user.save();

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture
        },
        token: token,
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.token = null;
        await user.save();
      }
    }

    req.session.destroy();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationToken', 'token'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
