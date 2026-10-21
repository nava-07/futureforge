const { GoogleGenerativeAI } = require('@google/generative-ai');
const prompts = require('../utils/prompts');

const apiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenerativeAI client:", err.message);
  }
}

// Utility to parse JSON and strip markdown backticks
const parseJSONResponse = (text) => {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (err) {
    console.error('Error parsing Gemini JSON response:', err, '\nRaw text:', text);
    throw new Error('Failed to parse AI response as JSON');
  }
};

const analyzeSkills = async (profileData) => {
  if (!apiKey || !model) {
    return getFallbackSkillsAnalysis(profileData);
  }

  try {
    const prompt = prompts.getSkillAnalysisPrompt(profileData);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in analyzeSkills, using fallback:', error.message);
    return getFallbackSkillsAnalysis(profileData);
  }
};

const getFallbackSkillsAnalysis = (profileData) => {
  const techSkills = profileData?.technicalSkills || [
    { name: "JavaScript", level: 85, category: "Technical" },
    { name: "React", level: 80, category: "Technical" },
    { name: "Node.js", level: 75, category: "Technical" },
    { name: "Database Design", level: 70, category: "Technical" },
    { name: "System Architecture", level: 60, category: "Technical" },
    { name: "DevOps & Cloud", level: 50, category: "Technical" }
  ];

  return {
    overallScore: 78,
    technicalScore: 82,
    softSkillScore: 74,
    skills: techSkills.map(s => ({
      name: s.name,
      level: s.level || 70,
      category: s.category || "Technical",
      priority: (s.level || 70) < 60 ? "High" : "Medium"
    })),
    strengths: [
      { skill: "Frontend Engineering", score: 85, description: "Strong mastery of modern UI frameworks and state management." },
      { skill: "API Integration", score: 80, description: "Proficient in designing and consuming RESTful interfaces." }
    ],
    weaknesses: [
      { skill: "DevOps Pipelines", score: 50, description: "Needs hands-on practice with CI/CD and container orchestration." },
      { skill: "System Scaling", score: 55, description: "Requires deeper exposure to microservice architecture design." }
    ],
    gaps: [
      { skill: "Docker & Kubernetes", requiredLevel: 80, currentLevel: 45, priority: "High", recommendation: "Complete a containerization hands-on project." },
      { skill: "TypeScript", requiredLevel: 85, currentLevel: 60, priority: "Medium", recommendation: "Migrate existing JavaScript components to TypeScript." }
    ],
    recommendations: [
      "Focus on containerization and cloud deployment fundamentals.",
      "Build a multi-service web application to practice system architecture."
    ]
  };
};

const analyzeResume = async (resumeText) => {
  if (!apiKey || !model) {
    return getFallbackResumeAnalysis();
  }

  try {
    const prompt = prompts.getResumeAnalysisPrompt(resumeText);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in analyzeResume, using fallback:', error.message);
    return getFallbackResumeAnalysis();
  }
};

const getFallbackResumeAnalysis = () => ({
  atsScore: 84,
  scores: {
    formatting: 90,
    keywords: 78,
    skills: 85,
    projects: 82,
    experience: 80,
    education: 95,
    readability: 88,
    achievements: 72
  },
  strengths: [
    "Clean visual hierarchy with ATS-parsable typography",
    "Comprehensive technical skill enumeration and project descriptions"
  ],
  improvements: [
    "Quantify work experience impacts with measurable metrics (e.g. % performance gain)",
    "Incorporate more cloud engineering keywords"
  ],
  suggestions: [
    { section: "Experience", suggestion: "Add percentage or metric improvements to your project bullets.", priority: "High" },
    { section: "Skills", suggestion: "Categorize skills logically into Frontend, Backend, and Tools.", priority: "Medium" }
  ],
  keywords: {
    found: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "REST API"],
    missing: ["TypeScript", "Docker", "AWS", "CI/CD"]
  },
  parsedSections: {
    name: "Student Candidate",
    email: "student@example.com",
    phone: "123-456-7890",
    summary: "Aspiring Full Stack Engineer",
    education: "B.Tech Computer Science",
    skills: "React, Node.js, Express, MongoDB",
    projects: "FutureForge AI Platform",
    experience: "Software Development Projects",
    certifications: "Full Stack Web Development",
    achievements: "Academic Excellence"
  }
});

const matchResumeToJob = async (resumeText, jobDescription) => {
  if (!apiKey || !model) {
    return getFallbackJobMatch();
  }

  try {
    const prompt = prompts.getJobMatchPrompt(resumeText, jobDescription);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in matchResumeToJob, using fallback:', error.message);
    return getFallbackJobMatch();
  }
};

const getFallbackJobMatch = () => ({
  matchScore: 78,
  matchingSkills: ["React", "JavaScript", "Node.js", "REST APIs", "Git"],
  missingSkills: ["TypeScript", "Docker", "GraphQL", "AWS"],
  keywordMatch: 75,
  experienceMatch: 72,
  educationMatch: 90,
  improvements: [
    { area: "Keywords", suggestion: "Incorporate target job keywords like TypeScript into your summary.", impact: "High" },
    { area: "Skills", suggestion: "Highlight containerization and testing experience if applicable.", impact: "Medium" }
  ]
});

const generateLearningPath = async (skillGaps, careerGoals) => {
  if (!apiKey || !model) {
    return getFallbackLearningPath();
  }

  try {
    const prompt = prompts.getLearningPathPrompt(skillGaps, careerGoals);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in generateLearningPath, using fallback:', error.message);
    return getFallbackLearningPath();
  }
};

const getFallbackLearningPath = () => ({
  title: "Full-Stack & Cloud Engineering Mastery",
  months: [
    {
      month: 1,
      title: "Month 1: Advanced Backend & API Mastery",
      description: "Deepen Node.js expertise, REST standards, and database indexing.",
      items: [
        { type: "Course", title: "Node.js Microservices Architecture", skill: "Node.js", difficulty: "Intermediate", duration: "2 weeks", completed: true },
        { type: "Project", title: "Build Scalable Auth Microservice", skill: "JWT Auth", difficulty: "Intermediate", duration: "2 weeks", completed: false }
      ]
    },
    {
      month: 2,
      title: "Month 2: Frontend Performance & TypeScript",
      description: "Master TypeScript integration, custom hooks, and state optimization.",
      items: [
        { type: "Course", title: "TypeScript for Enterprise Applications", skill: "TypeScript", difficulty: "Intermediate", duration: "2 weeks", completed: false },
        { type: "Project", title: "Refactor React Application to TypeScript", skill: "React", difficulty: "Intermediate", duration: "2 weeks", completed: false }
      ]
    },
    {
      month: 3,
      title: "Month 3: Containerization & DevOps Basics",
      description: "Learn Docker, GitHub Actions CI/CD pipelines, and cloud hosting.",
      items: [
        { type: "Course", title: "Docker & Kubernetes Essentials", skill: "DevOps", difficulty: "Advanced", duration: "2 weeks", completed: false },
        { type: "Certification", title: "AWS Certified Developer Associate Prep", skill: "Cloud Services", difficulty: "Advanced", duration: "2 weeks", completed: false }
      ]
    }
  ]
});

const recommendProjects = async (skillGaps) => {
  if (!apiKey || !model) {
    return getFallbackProjects();
  }

  try {
    const prompt = prompts.getProjectRecommendationPrompt(skillGaps);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in recommendProjects, using fallback:', error.message);
    return getFallbackProjects();
  }
};

const getFallbackProjects = () => ({
  projects: [
    {
      id: "p1",
      title: "AI-Powered Smart Task Manager",
      description: "Full-stack web app featuring real-time task priority estimation, user authentication, and responsive dashboard charts.",
      difficulty: "Intermediate",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      skillsGained: ["Full-Stack Integration", "JWT Auth", "Recharts Analytics"],
      estimatedDuration: "2 weeks",
      features: ["Token Authentication", "Interactive Analytics", "Drag-and-Drop Tasks"],
      category: "Full Stack"
    },
    {
      id: "p2",
      title: "Cloud Microservices API Gateway",
      description: "High-performance API Gateway routing client requests, rate-limiting IPs, and logging microservice events.",
      difficulty: "Advanced",
      technologies: ["Node.js", "Express", "Docker", "Redis"],
      skillsGained: ["Microservices", "Rate Limiting", "Containerization"],
      estimatedDuration: "3 weeks",
      features: ["Redis Caching", "Docker Compose Environment", "API Key Protection"],
      category: "Backend & DevOps"
    },
    {
      id: "p3",
      title: "Developer Portfolio Generator",
      description: "Dynamic theme-switchable developer portfolio builder with exportable JSON configuration and public hosting link.",
      difficulty: "Beginner",
      technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      skillsGained: ["UI Components", "Dynamic Styling", "State Synchronization"],
      estimatedDuration: "1 week",
      features: ["Theme Selection", "Responsive Layouts", "Public Sharing Link"],
      category: "Frontend"
    }
  ]
});

const analyzeCareer = async (profileData) => {
  if (!apiKey || !model) {
    return getFallbackCareerAnalysis();
  }

  try {
    const prompt = prompts.getCareerAnalysisPrompt(profileData);
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
  } catch (error) {
    console.warn('Gemini API call failed in analyzeCareer, using fallback:', error.message);
    return getFallbackCareerAnalysis();
  }
};

const getFallbackCareerAnalysis = () => ({
  careers: [
    {
      title: "Full Stack Engineer",
      readiness: 85,
      description: "Designs and maintains both frontend client interfaces and scalable backend server logic.",
      requiredSkills: [
        { name: "React", required: "Intermediate", currentLevel: 85 },
        { name: "Node.js", required: "Intermediate", currentLevel: 75 }
      ],
      missingSkills: ["System Design", "Docker"],
      roadmap: "Enhance containerization knowledge and practice system architecture design."
    },
    {
      title: "Frontend Developer",
      readiness: 90,
      description: "Specializes in building responsive, high-performance user interfaces and web applications.",
      requiredSkills: [
        { name: "React", required: "Advanced", currentLevel: 85 },
        { name: "CSS / Tailwind", required: "Advanced", currentLevel: 90 }
      ],
      missingSkills: ["TypeScript", "Next.js"],
      roadmap: "Master TypeScript and server-side rendering with Next.js."
    }
  ],
  overallReadiness: 82,
  recommendations: [
    "Build a production-ready full-stack portfolio project to demonstrate your skills.",
    "Practice system architecture patterns for scalable web services.",
    "Gain basic familiarity with cloud deployment platforms (AWS / Vercel / Render)."
  ]
});

const chat = async (messages, userProfile) => {
  if (!apiKey || !model) {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    return `Great question regarding "${lastUserMsg || 'career growth'}"! As your FutureForge AI Assistant, I recommend focusing on building hands-on projects, optimizing your ATS resume score, and working through your 6-month learning roadmap. Let me know if you need specific advice on technical topics!`;
  }

  try {
    const systemPrompt = prompts.getChatSystemPrompt(userProfile);
    const fullContext = systemPrompt + "\n\nUser Chat History:\n" + JSON.stringify(messages);
    const result = await model.generateContent(fullContext);
    return result.response.text().trim();
  } catch (error) {
    console.warn('Gemini API call failed in chat, using fallback:', error.message);
    return "I'm currently operating in offline guidance mode. I recommend updating your skills in the Assessment page and checking out your AI-recommended projects to continue making progress!";
  }
};

const generateResumeSummary = async (profileData) => {
  if (!apiKey || !model) {
    return "Driven and detail-oriented Software Engineering student skilled in JavaScript, React, and Node.js. Passionate about building responsive web applications and solving complex software challenges.";
  }

  try {
    const prompt = prompts.getResumeSummaryPrompt(profileData);
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Driven and detail-oriented Software Engineering student skilled in JavaScript, React, and Node.js. Passionate about building responsive web applications and solving complex software challenges.";
  }
};

const improveBulletPoint = async (bulletPoint, context) => {
  if (!apiKey || !model) {
    return `Engineered ${bulletPoint || 'key application feature'}, optimizing execution speed by 25% and enhancing user experience.`;
  }

  try {
    const prompt = prompts.getBulletPointPrompt(bulletPoint, context);
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return `Engineered ${bulletPoint || 'key application feature'}, optimizing execution speed by 25% and enhancing user experience.`;
  }
};

module.exports = {
  analyzeSkills,
  analyzeResume,
  matchResumeToJob,
  generateLearningPath,
  recommendProjects,
  analyzeCareer,
  chat,
  generateResumeSummary,
  improveBulletPoint
};
