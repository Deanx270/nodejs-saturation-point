const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'premium_pen_secret');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid Token. User not found.' });
    }

    if (user.token !== token) {
      return res.status(401).json({ error: 'Token is invalid or expired. Please log in again.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'head_admin')) {
    next();
  } else {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
};

const isStaffOrAdmin = (req, res, next) => {
  if (req.user && ['staff', 'admin', 'head_admin'].includes(req.user.role)) {
    next();
  } else {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
};

module.exports = { verifyToken, isAdmin, isStaffOrAdmin };
