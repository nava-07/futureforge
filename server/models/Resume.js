const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  originalFilename: String,
  filePath: String,
  fileType: String,
  extractedText: String,
  parsedData: {
    name: String,
    email: String,
    phone: String,
    summary: String,
    education: [mongoose.Schema.Types.Mixed],
    skills: [String],
    projects: [mongoose.Schema.Types.Mixed],
    experience: [mongoose.Schema.Types.Mixed],
    certifications: [mongoose.Schema.Types.Mixed],
    achievements: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
