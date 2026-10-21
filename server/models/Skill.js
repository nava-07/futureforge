const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft']
  },
  level: {
    type: Number,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low']
  },
  source: {
    type: String,
    enum: ['self-assessed', 'ai-analyzed']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
