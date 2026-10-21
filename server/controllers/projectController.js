const Project = require('../models/Project');
const SkillAssessment = require('../models/SkillAssessment');
const geminiService = require('../services/geminiService');

exports.getRecommendedProjects = async (req, res) => {
  try {
    const assessment = await SkillAssessment.findOne({ user: req.user.id }).sort('-createdAt');
    const skillGaps = assessment ? assessment.analysis.skillGaps : [];
    
    const recommendations = await geminiService.recommendProjects(skillGaps);
    
    const projects = [];
    for (const projData of recommendations.projects || []) {
        const project = await Project.create({
            user: req.user.id,
            ...projData
        });
        projects.push(project);
    }
    
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
