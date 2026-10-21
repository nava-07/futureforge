const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  technologies: [String],
  skillsGained: [String],
  estimatedDuration: String,
  features: [String],
  category: String,
  forSkillGaps: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
