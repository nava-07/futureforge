const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  company: String,
  description: String,
  requiredSkills: [String],
  preferredSkills: [String],
  experienceRequired: String,
  educationRequired: String
}, {
  timestamps: true
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
