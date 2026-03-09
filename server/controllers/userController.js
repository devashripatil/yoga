const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.wellnessGoal = req.body.wellnessGoal || user.wellnessGoal;
      user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
      user.preferredTime = req.body.preferredTime || user.preferredTime;
      user.dietPreference = req.body.dietPreference || user.dietPreference;
      if (req.body.timeAvailable) user.timeAvailable = req.body.timeAvailable;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        wellnessGoal: updatedUser.wellnessGoal,
        experienceLevel: updatedUser.experienceLevel,
        preferredTime: updatedUser.preferredTime,
        dietPreference: updatedUser.dietPreference,
        timeAvailable: updatedUser.timeAvailable,
        coachPlan: updatedUser.coachPlan
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Don't let admins delete themselves via this route easily
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin users' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  updateUserProfile,
  getUsers,
  deleteUser
};
