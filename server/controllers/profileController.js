const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', '-password');
    if (!profile) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    let profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { ...profileData, user: req.user.id },
      { new: true, upsert: true }
    );
    
    // Mark user onboarding as complete
    await User.findByIdAndUpdate(req.user.id, { onboardingComplete: true });
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await StudentProfile.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
