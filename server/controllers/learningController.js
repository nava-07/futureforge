const LearningPath = require('../models/LearningPath');
const SkillAssessment = require('../models/SkillAssessment');
const StudentProfile = require('../models/StudentProfile');
const Progress = require('../models/Progress');
const geminiService = require('../services/geminiService');

exports.getLearningPath = async (req, res) => {
  try {
    let path = await LearningPath.findOne({ user: req.user.id });
    if (!path) {
      const profile = await StudentProfile.findOne({ user: req.user.id });
      const assessment = await SkillAssessment.findOne({ user: req.user.id }).sort('-createdAt');
      
      const skillGaps = assessment ? (assessment.gaps || []) : [];
      const careerGoals = profile ? (profile.careerGoals || {}) : {};
      
      const generatedPath = await geminiService.generateLearningPath(skillGaps, careerGoals);
      
      path = await LearningPath.create({
        user: req.user.id,
        title: generatedPath.title || 'Personalized Skill Optimization Roadmap',
        months: generatedPath.months || [],
        overallProgress: 0
      });
    }
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    console.error('Get Learning Path Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateLearningPath = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    const assessment = await SkillAssessment.findOne({ user: req.user.id }).sort('-createdAt');
    
    const skillGaps = assessment ? (assessment.gaps || []) : [];
    const careerGoals = profile ? (profile.careerGoals || {}) : {};
    
    const generatedPath = await geminiService.generateLearningPath(skillGaps, careerGoals);
    
    const path = await LearningPath.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        title: generatedPath.title || 'Personalized Skill Optimization Roadmap',
        months: generatedPath.months || [],
        overallProgress: 0
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    console.error('Generate Learning Path Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { monthIndex, itemIndex, completed } = req.body;
    
    const path = await LearningPath.findOne({ user: req.user.id });
    if (!path) {
      return res.status(404).json({ success: false, message: 'Learning path not found' });
    }
    
    if (monthIndex !== undefined && itemIndex !== undefined && path.months[monthIndex]?.items[itemIndex]) {
      path.months[monthIndex].items[itemIndex].completed = completed;
      if (completed) {
        path.months[monthIndex].items[itemIndex].completedAt = new Date();
      }
    }

    // Recalculate progress
    let total = 0;
    let done = 0;
    path.months.forEach(m => {
      m.items.forEach(i => {
        total++;
        if (i.completed) done++;
      });
    });

    path.overallProgress = total > 0 ? Math.round((done / total) * 100) : 0;
    await path.save();

    await Progress.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        learningProgress: { totalItems: total, completedItems: done, percentage: path.overallProgress }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    console.error('Update Learning Progress Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
