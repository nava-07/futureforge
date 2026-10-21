const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  skillHistory: [{
    date: Date,
    skills: [{
      name: String,
      level: Number
    }],
    overallScore: Number
  }],
  resumeScoreHistory: [{
    date: Date,
    score: Number
  }],
  learningProgress: {
    totalItems: Number,
    completedItems: Number,
    percentage: Number
  },
  careerReadiness: Number,
  recentActivity: [{
    type: { type: String },
    description: String,
    date: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
