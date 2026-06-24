const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password } = req.body;
    let { firstName, lastName } = req.body;

    const formatName = (name) => {
      if (!name) return '';
      return name.replace(/[^a-zA-Z\s]/g, '').substring(0, 30).replace(/\b[a-z]/g, char => char.toUpperCase());
    };

    if (firstName) user.firstName = formatName(firstName);
    if (lastName) user.lastName = formatName(lastName);

    if (req.file) {
      user.profilePicture = '/images/uploads/' + req.file.filename;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
