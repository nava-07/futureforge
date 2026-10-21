const JobDescription = require('../models/JobDescription');
const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');
const geminiService = require('../services/geminiService');

exports.analyzeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobDescriptionText, jobTitle, company } = req.body;
    
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found. Please upload a resume first.' });
    }
    
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to resume' });
    }

    const matchResults = await geminiService.matchResumeToJob(resume.extractedText, jobDescriptionText);
    
    const jobDescription = await JobDescription.create({
      user: req.user.id,
      description: jobDescriptionText,
      title: jobTitle || 'Target Role',
      company: company || 'Target Company'
    });

    const jobMatch = await JobMatch.create({
      user: req.user.id,
      resume: resume._id,
      jobDescription: jobDescription._id,
      ...matchResults
    });

    res.status(200).json({ success: true, data: jobMatch });
  } catch (error) {
    console.error('Job Match Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMatchHistory = async (req, res) => {
  try {
    const matches = await JobMatch.find({ user: req.user.id }).populate('jobDescription').sort('-createdAt');
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
