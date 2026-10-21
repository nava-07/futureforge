const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    phone: String,
    location: String,
    bio: String,
    linkedIn: String,
    github: String,
    portfolio: String
  },
  academic: {
    college: String,
    department: String,
    degree: String,
    yearOfStudy: String,
    gpa: String,
    graduationYear: String
  },
  technicalSkills: [{
    name: String,
    level: { type: Number, min: 0, max: 100 },
    category: String
  }],
  softSkills: [{
    name: String,
    level: { type: Number, min: 0, max: 100 }
  }],
  interests: [String],
  careerGoals: {
    targetRole: String,
    targetCompanyType: String,
    timeline: String,
    summary: String
  },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
    duration: String
  }],
  certifications: [{
    title: String,
    provider: String,
    date: Date,
    link: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
