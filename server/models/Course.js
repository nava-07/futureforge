const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  provider: String,
  skill: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: String,
  url: String,
  description: String,
  priority: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
