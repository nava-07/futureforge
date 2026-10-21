const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  about: String,
  headline: String,
  skills: [{
    name: String,
    level: Number,
    category: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
    image: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: String,
    gpa: String
  }],
  certifications: [{
    title: String,
    provider: String,
    date: Date,
    link: String
  }],
  achievements: [String],
  contact: {
    email: String,
    phone: String,
    linkedIn: String,
    github: String,
    website: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'default'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
