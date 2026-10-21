const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  months: [{
    month: Number,
    title: String,
    description: String,
    items: [{
      type: {
        type: String,
        enum: ['course', 'project', 'certification']
      },
      title: String,
      skill: String,
      difficulty: String,
      duration: String,
      priority: String,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }]
  }],
  overallProgress: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
