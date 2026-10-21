const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: String,
  provider: String,
  skill: String,
  duration: String,
  url: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Certification', certificationSchema);
