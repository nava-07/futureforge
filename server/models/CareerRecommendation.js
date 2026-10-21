const mongoose = require('mongoose');

const careerRecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  careers: [{
    title: String,
    readiness: Number,
    description: String,
    requiredSkills: [{
      name: String,
      required: Boolean,
      currentLevel: Number
    }],
    missingSkills: [String],
    roadmap: String
  }],
  overallReadiness: Number,
  recommendations: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerRecommendation', careerRecommendationSchema);
