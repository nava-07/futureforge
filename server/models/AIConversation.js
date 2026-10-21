const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AIConversation', aiConversationSchema);
