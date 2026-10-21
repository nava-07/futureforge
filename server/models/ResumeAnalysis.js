const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  atsScore: Number,
  scores: {
    formatting: Number,
    keywords: Number,
    skills: Number,
    projects: Number,
    experience: Number,
    education: Number,
    readability: Number,
    achievements: Number
  },
  strengths: [String],
  improvements: [String],
  suggestions: [{
    section: String,
    suggestion: String,
    priority: String
  }],
  keywords: {
    found: [String],
    missing: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
