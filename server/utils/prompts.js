const getSkillAnalysisPrompt = (profileData) => `
Analyze the following student profile data and evaluate their skills. 
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "overallScore": 0-100,
  "technicalScore": 0-100,
  "softSkillScore": 0-100,
  "skills": [{ "name": "Skill Name", "level": "Beginner/Intermediate/Advanced", "category": "Technical/Soft", "priority": "High/Medium/Low" }],
  "strengths": [{ "skill": "Skill", "score": 0-100, "description": "Why it's a strength" }],
  "weaknesses": [{ "skill": "Skill", "score": 0-100, "description": "Why it's a weakness" }],
  "gaps": [{ "skill": "Skill", "requiredLevel": "Required level", "currentLevel": "Current level", "priority": "Priority", "recommendation": "How to improve" }],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Profile Data:
${JSON.stringify(profileData, null, 2)}
`;

const getResumeAnalysisPrompt = (resumeText) => `
Analyze the following resume text.
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "atsScore": 0-100,
  "scores": {
    "formatting": 0-100,
    "keywords": 0-100,
    "skills": 0-100,
    "projects": 0-100,
    "experience": 0-100,
    "education": 0-100,
    "readability": 0-100,
    "achievements": 0-100
  },
  "strengths": ["Strength 1"],
  "improvements": ["Improvement 1"],
  "suggestions": [{ "section": "Section name", "suggestion": "Suggestion text", "priority": "High/Medium/Low" }],
  "keywords": { "found": ["Keyword"], "missing": ["Keyword"] },
  "parsedSections": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "summary": "Summary",
    "education": "Education details",
    "skills": "Skills details",
    "projects": "Projects details",
    "experience": "Experience details",
    "certifications": "Certifications details",
    "achievements": "Achievements details"
  }
}

Resume Text:
${resumeText}
`;

const getJobMatchPrompt = (resumeText, jobDescription) => `
Compare the resume text to the job description.
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "matchScore": 0-100,
  "matchingSkills": ["Skill 1"],
  "missingSkills": ["Skill 1"],
  "keywordMatch": 0-100,
  "experienceMatch": 0-100,
  "educationMatch": 0-100,
  "improvements": [{ "area": "Area name", "suggestion": "Suggestion text", "impact": "High/Medium/Low" }]
}

Job Description:
${jobDescription}

Resume Text:
${resumeText}
`;

const getLearningPathPrompt = (skillGaps, careerGoals) => `
Generate a personalized learning roadmap based on the skill gaps and career goals.
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "title": "Roadmap Title",
  "months": [
    {
      "month": 1,
      "title": "Month Title",
      "description": "Month description",
      "items": [
        { "type": "Course/Project/Book", "title": "Item Title", "skill": "Skill targeted", "difficulty": "Beginner/Intermediate/Advanced", "duration": "Duration", "priority": "High/Medium/Low" }
      ]
    }
  ]
}

Skill Gaps:
${JSON.stringify(skillGaps, null, 2)}

Career Goals:
${JSON.stringify(careerGoals, null, 2)}
`;

const getProjectRecommendationPrompt = (skillGaps) => `
Recommend projects to help bridge the provided skill gaps.
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "projects": [
    {
      "title": "Project Title",
      "description": "Project description",
      "difficulty": "Beginner/Intermediate/Advanced",
      "technologies": ["Tech 1", "Tech 2"],
      "skillsGained": ["Skill 1"],
      "estimatedDuration": "Duration",
      "features": ["Feature 1"],
      "category": "Web/Mobile/AI/etc"
    }
  ]
}

Skill Gaps:
${JSON.stringify(skillGaps, null, 2)}
`;

const getCareerAnalysisPrompt = (profileData) => `
Analyze the profile data for potential career paths.
Return ONLY a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json.
{
  "careers": [
    {
      "title": "Career Title",
      "readiness": 0-100,
      "description": "Career description",
      "requiredSkills": [{ "name": "Skill Name", "required": "Required level", "currentLevel": "Current level" }],
      "missingSkills": ["Missing Skill"],
      "roadmap": "Short roadmap description"
    }
  ],
  "overallReadiness": 0-100,
  "recommendations": ["Recommendation 1"]
}

Profile Data:
${JSON.stringify(profileData, null, 2)}
`;

const getChatSystemPrompt = (userProfile) => `
You are the FutureForge AI Career Assistant. You have access to the user's profile and should provide personalized career, resume, and learning advice.
Be encouraging, professional, and concise.

User Profile context:
${JSON.stringify(userProfile, null, 2)}
`;

const getResumeSummaryPrompt = (profileData) => `
Generate a professional summary for a resume based on this profile data. Return ONLY the text of the summary without any quotes or markdown.

Profile Data:
${JSON.stringify(profileData, null, 2)}
`;

const getBulletPointPrompt = (bulletPoint, context) => `
Improve this resume bullet point to make it more impactful and results-oriented (using action verbs and metrics if possible). 
Context: ${context || 'None'}
Bullet Point: ${bulletPoint}

Return ONLY the improved bullet point text without any quotes or markdown.
`;

module.exports = {
  getSkillAnalysisPrompt,
  getResumeAnalysisPrompt,
  getJobMatchPrompt,
  getLearningPathPrompt,
  getProjectRecommendationPrompt,
  getCareerAnalysisPrompt,
  getChatSystemPrompt,
  getResumeSummaryPrompt,
  getBulletPointPrompt
};
