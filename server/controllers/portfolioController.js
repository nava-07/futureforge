const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

exports.createOrUpdatePortfolio = async (req, res) => {
  try {
    const portfolioData = req.body;
    
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { ...portfolioData, user: req.user.id },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    const portfolio = await Portfolio.findOne({ username }).populate('user', 'name email college department degree');
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
