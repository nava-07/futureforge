const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  overallScore: Number,
  technicalScore: Number,
  softSkillScore: Number,
  skills: [{
    name: String,
    level: Number,
    category: String,
    priority: String
  }],
  strengths: [{
    skill: String,
    score: Number,
    description: String
  }],
  weaknesses: [{
    skill: String,
    score: Number,
    description: String
  }],
  gaps: [{
    skill: String,
    requiredLevel: Number,
    currentLevel: Number,
    priority: String,
    recommendation: String
  }],
  recommendations: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
