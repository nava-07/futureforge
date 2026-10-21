const AIConversation = require('../models/AIConversation');
const StudentProfile = require('../models/StudentProfile');
const CareerRecommendation = require('../models/CareerRecommendation');
const geminiService = require('../services/geminiService');

exports.chat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    let conversation;
    
    if (conversationId) {
      conversation = await AIConversation.findOne({ _id: conversationId, user: req.user.id });
    }
    
    if (!conversation) {
      conversation = await AIConversation.create({
        user: req.user.id,
        messages: []
      });
    }
    
    conversation.messages.push({ role: 'user', content: message });
    
    const profile = await StudentProfile.findOne({ user: req.user.id });
    
    const response = await geminiService.chat(conversation.messages, profile);
    
    conversation.messages.push({ role: 'assistant', content: response });
    await conversation.save();
    
    res.status(200).json({ success: true, data: { conversationId: conversation._id, response, messages: conversation.messages } });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await AIConversation.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({ _id: req.params.id, user: req.user.id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    await AIConversation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.skillAnalysis = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    const analysis = await geminiService.analyzeSkills(profile);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.careerAnalysis = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    const analysis = await geminiService.analyzeCareer(profile);
    
    const recommendation = await CareerRecommendation.create({
      user: req.user.id,
      careers: analysis.careers || [],
      overallReadiness: analysis.overallReadiness || 70,
      recommendations: analysis.recommendations || []
    });
    
    res.status(200).json({ success: true, data: { ...analysis, id: recommendation._id } });
  } catch (error) {
    console.error('Career Analysis Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
