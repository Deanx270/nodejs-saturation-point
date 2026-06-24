const { User } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'token'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'customer'].includes(role) && role !== 'head_admin') {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (role === 'head_admin') {
      return res.status(403).json({ error: 'Cannot upgrade a user to Head Admin via UI' });
    }

    const user = await User.findByPk(req.params.id);

    if (user) {
      if (req.user.id === user.id) {
        return res.status(400).json({ error: 'You cannot change your own role' });
      }
      if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'head_admin')) {
        return res.status(403).json({ error: 'Admins cannot modify other admins or head admins' });
      }
      if (req.user.role === 'head_admin' && user.role === 'head_admin') {
        return res.status(403).json({ error: 'Head Admins cannot modify other Head Admins' });
      }

      user.role = role;
      await user.save();

      res.json({ message: 'User role updated successfully', user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'deactivated'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findByPk(req.params.id);

    if (user) {
      if (req.user.id === user.id) {
        return res.status(400).json({ error: 'You cannot change your own status' });
      }
      if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'head_admin')) {
        return res.status(403).json({ error: 'Admins cannot modify other admins or head admins' });
      }
      if (req.user.role === 'head_admin' && user.role === 'head_admin') {
        return res.status(403).json({ error: 'Head Admins cannot modify other Head Admins' });
      }

      user.status = status;
      await user.save();

      res.json({ message: 'User status updated successfully', user: { id: user.id, firstName: user.firstName, lastName: user.lastName, status: user.status } });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.user.id === user.id) {
      return res.status(400).json({ error: 'You cannot edit yourself here' });
    }
    if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'head_admin')) {
      return res.status(403).json({ error: 'Admins cannot modify other admins or head admins' });
    }
    if (req.user.role === 'head_admin' && user.role === 'head_admin') {
      return res.status(403).json({ error: 'Head Admins cannot modify other Head Admins' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.user.id === user.id) {
      return res.status(400).json({ error: 'You cannot delete yourself' });
    }
    if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'head_admin')) {
      return res.status(403).json({ error: 'Admins cannot delete other admins or head admins' });
    }
    if (req.user.role === 'head_admin' && user.role === 'head_admin') {
      return res.status(403).json({ error: 'Head Admins cannot delete other Head Admins' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
