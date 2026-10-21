const Skill = require('../models/Skill');
const SkillAssessment = require('../models/SkillAssessment');
const Progress = require('../models/Progress');
const StudentProfile = require('../models/StudentProfile');
const geminiService = require('../services/geminiService');

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSkills = async (req, res) => {
  try {
    const skillsData = req.body.skills;
    if (!Array.isArray(skillsData)) {
      return res.status(400).json({ success: false, message: 'Skills must be an array' });
    }
    
    const results = [];
    for (const skill of skillsData) {
      const updated = await Skill.findOneAndUpdate(
        { user: req.user.id, name: skill.name },
        { ...skill, user: req.user.id },
        { new: true, upsert: true }
      );
      results.push(updated);
    }
    
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.analyzeSkills = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user.id,
        technicalSkills: [
          { name: "JavaScript", level: 85, category: "Technical" },
          { name: "React", level: 80, category: "Technical" },
          { name: "Node.js", level: 75, category: "Technical" },
          { name: "Database Design", level: 70, category: "Technical" },
          { name: "DevOps & Cloud", level: 50, category: "Technical" }
        ],
        softSkills: [
          { name: "Problem Solving", level: 85 },
          { name: "Communication", level: 80 }
        ],
        careerGoals: { targetRole: "Full Stack Engineer" }
      });
    }

    const analysisResults = await geminiService.analyzeSkills(profile);
    
    const assessment = await SkillAssessment.create({
      user: req.user.id,
      ...analysisResults
    });

    if (analysisResults.skills) {
      for (const skill of analysisResults.skills) {
        await Skill.findOneAndUpdate(
          { user: req.user.id, name: skill.name },
          { ...skill, user: req.user.id },
          { new: true, upsert: true }
        );
      }
    }
    
    await Progress.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, lastSkillAssessment: assessment._id },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: analysisResults });
  } catch (error) {
    console.error('Analyze Skills Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
