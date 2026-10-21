const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Progress = require('../models/Progress');
const geminiService = require('../services/geminiService');
const resumeParser = require('../services/resumeParser');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { text, parsedData } = await resumeParser.parseResume(req.file.path, req.file.mimetype);

    const resume = await Resume.create({
      user: req.user.id,
      originalFilename: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      extractedText: text,
      parsedData
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error('Upload Resume Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume found. Please upload a resume first.' });
    }

    const analysis = await geminiService.analyzeResume(resume.extractedText);
    
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user.id,
      resume: resume._id,
      atsScore: analysis.atsScore || 75,
      scores: analysis.scores || {},
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      suggestions: analysis.suggestions || [],
      keywords: analysis.keywords || { found: [], missing: [] }
    });

    if (analysis.atsScore) {
      await Progress.findOneAndUpdate(
        { user: req.user.id },
        { user: req.user.id, latestResumeScore: analysis.atsScore },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ success: true, data: resumeAnalysis });
  } catch (error) {
    console.error('Analyze Resume Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ user: req.user.id }).sort('-createdAt');
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'No analysis found' });
    }
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');
    if (!resume) {
      return res.status(200).json({
        success: true,
        data: {
          personalInfo: {},
          summary: '',
          education: [],
          skills: [],
          projects: [],
          experience: [],
          certifications: [],
          achievements: [],
          languages: []
        }
      });
    }

    const data = resume.parsedData || {};
    res.status(200).json({
      success: true,
      data: {
        personalInfo: data.personalInfo || { fullName: data.name, email: data.email, phone: data.phone },
        summary: data.summary || '',
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        experience: data.experience || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        languages: data.languages || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');
    if (resume) {
      resume.parsedData = req.body;
      await resume.save();
    } else {
      resume = await Resume.create({
        user: req.user.id,
        originalFilename: 'My Resume',
        filePath: '',
        fileType: 'application/json',
        extractedText: JSON.stringify(req.body),
        parsedData: req.body
      });
    }
    res.status(200).json({ success: true, data: resume.parsedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
