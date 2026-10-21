const mongoose = require('mongoose');

const jobMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription'
  },
  matchScore: Number,
  matchingSkills: [String],
  missingSkills: [String],
  keywordMatch: Number,
  experienceMatch: Number,
  educationMatch: Number,
  improvements: [{
    area: String,
    suggestion: String,
    impact: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('JobMatch', jobMatchSchema);
