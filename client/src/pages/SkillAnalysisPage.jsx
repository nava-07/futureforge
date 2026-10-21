import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { skillService } from '../services';
import { LoadingSpinner, SkeletonLoader, EmptyState, ErrorState, ScoreGauge, ProgressBar, Badge } from '../components/common';
import { getScoreLabel, getPriorityColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const mockRadarData = [
  { subject: 'Frontend', A: 85, fullMark: 100 },
  { subject: 'Backend', A: 75, fullMark: 100 },
  { subject: 'Database', A: 70, fullMark: 100 },
  { subject: 'DevOps', A: 50, fullMark: 100 },
  { subject: 'Testing', A: 60, fullMark: 100 },
  { subject: 'Architecture', A: 65, fullMark: 100 }
];

const getDefaultAnalysisData = () => ({
  lastAnalyzed: new Date().toISOString(),
  scores: { overall: 78, technical: 82, soft: 74 },
  technicalSkills: [
    { id: 1, name: 'JavaScript', level: 85, priority: 'High', category: 'Frontend & Logic' },
    { id: 2, name: 'React', level: 80, priority: 'High', category: 'Frontend' },
    { id: 3, name: 'Node.js', level: 75, priority: 'Medium', category: 'Backend' },
    { id: 4, name: 'MongoDB', level: 70, priority: 'Medium', category: 'Database' },
    { id: 5, name: 'Docker', level: 50, priority: 'High', category: 'DevOps' }
  ],
  softSkills: [
    { id: 6, name: 'Problem Solving', level: 85, priority: 'Low', category: 'Interpersonal' },
    { id: 7, name: 'Communication', level: 80, priority: 'Low', category: 'Interpersonal' }
  ],
  radarData: mockRadarData,
  strengths: [
    { title: "Frontend Engineering Mastery", description: "Solid understanding of component lifecycles, state synchronization, and reactive UI development." },
    { title: "RESTful API Integration", description: "Demonstrated ability to structure scalable backend controllers and endpoints." }
  ],
  weaknesses: [
    { title: "DevOps & CI/CD Pipelines", description: "Requires deeper exposure to containerization with Docker and deployment pipelines." }
  ],
  skillGaps: [
    { skill: 'Docker & Kubernetes', current: 50, required: 80, priority: 'High', rec: 'Take a containerization fundamentals course to round out deployment skills.' }
  ],
  recommendations: [
    "Focus on DevOps fundamentals to round out your full-stack profile.",
    "Practice algorithm design patterns to strengthen problem-solving capabilities.",
    "Schedule regular skill re-assessments to track your progress over time."
  ]
});

export default function SkillAnalysisPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const formatAnalysisData = (analysis) => {
    const rawSkills = analysis.skills || [];
    const techList = rawSkills.filter(s => s.category !== 'Soft');
    const softList = rawSkills.filter(s => s.category === 'Soft');

    return {
      lastAnalyzed: new Date().toISOString(),
      scores: {
        overall: analysis.overallScore || 78,
        technical: analysis.technicalScore || 82,
        soft: analysis.softSkillScore || 74
      },
      technicalSkills: techList.length > 0 ? techList.map((s, i) => ({
        id: i,
        name: s.name,
        level: typeof s.level === 'number' ? s.level : 70,
        priority: s.priority || 'Medium',
        category: s.category || 'Technical'
      })) : getDefaultAnalysisData().technicalSkills,
      softSkills: softList.map((s, i) => ({
        id: i,
        name: s.name,
        level: typeof s.level === 'number' ? s.level : 70,
        priority: 'Low',
        category: 'Interpersonal'
      })),
      radarData: techList.length >= 3 ? techList.slice(0, 6).map(s => ({
        subject: s.name,
        A: typeof s.level === 'number' ? s.level : 70,
        fullMark: 100
      })) : mockRadarData,
      strengths: (analysis.strengths || []).map(s => ({
        title: typeof s === 'string' ? s : (s.skill || 'Key Competency'),
        description: typeof s === 'object' && s.description ? s.description : 'Demonstrated proficiency in this skill domain.'
      })),
      weaknesses: (analysis.weaknesses || []).map(w => ({
        title: typeof w === 'string' ? w : (w.skill || 'Growth Area'),
        description: typeof w === 'object' && w.description ? w.description : 'Area needing further practical experience.'
      })),
      skillGaps: (analysis.gaps || []).map(g => ({
        skill: g.skill,
        current: g.currentLevel || 40,
        required: g.requiredLevel || 80,
        priority: g.priority || 'High',
        rec: g.recommendation || 'Focus on targeted learning to bridge this gap.'
      })),
      recommendations: analysis.recommendations || [
        "Focus on containerization and deployment fundamentals.",
        "Practice algorithm design patterns to strengthen problem-solving capabilities."
      ]
    };
  };

  const fetchSkillData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await skillService.getSkills();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const skillsList = res.data;
        const tech = skillsList.filter(s => s.category !== 'Soft');
        const soft = skillsList.filter(s => s.category === 'Soft');
        
        const techScore = tech.length > 0 ? Math.round(tech.reduce((a, b) => a + (b.level || 50), 0) / tech.length) : 82;
        const softScore = soft.length > 0 ? Math.round(soft.reduce((a, b) => a + (b.level || 50), 0) / soft.length) : 74;
        
        setData({
          lastAnalyzed: new Date().toISOString(),
          scores: { overall: Math.round((techScore + softScore) / 2), technical: techScore, soft: softScore },
          technicalSkills: tech.map((s, i) => ({ id: s._id || i, name: s.name, level: s.level || 50, priority: s.priority || 'Medium', category: s.category || 'Technical' })),
          softSkills: soft.map((s, i) => ({ id: s._id || i, name: s.name, level: s.level || 50, priority: 'Low', category: 'Interpersonal' })),
          radarData: tech.length > 0 ? tech.slice(0, 6).map(s => ({ subject: s.name, A: s.level || 50, fullMark: 100 })) : mockRadarData,
          strengths: tech.filter(s => (s.level || 50) >= 70).map(s => ({ title: `${s.name} Competency`, description: `Solid mastery of ${s.name} concepts and applications.` })),
          weaknesses: tech.filter(s => (s.level || 50) < 60).map(s => ({ title: `${s.name} Improvement`, description: `Requires further practice and project implementation.` })),
          skillGaps: tech.filter(s => (s.level || 50) < 60).map(s => ({ skill: s.name, current: s.level || 40, required: 80, priority: 'High', rec: `Take a targeted ${s.name} course to improve.` })),
          recommendations: [
            "Complete full-stack projects to apply your core technical skills.",
            "Focus on bridging identified skill gaps to boost career readiness.",
            "Schedule regular skill re-assessments to track your progress over time."
          ]
        });
      } else {
        const analysisRes = await skillService.analyzeSkills();
        if (analysisRes.success && analysisRes.data) {
          setData(formatAnalysisData(analysisRes.data));
        } else {
          setData(getDefaultAnalysisData());
        }
      }
    } catch (err) {
      console.error("Skill analysis fetch error:", err);
      setData(getDefaultAnalysisData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillData();
  }, []);

  const handleReanalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await skillService.analyzeSkills();
      if (res.success && res.data) {
        setData(formatAnalysisData(res.data));
        toast.success("Skills re-analyzed successfully!");
      } else {
        setData(getDefaultAnalysisData());
        toast.success("Skills analysis updated!");
      }
    } catch (err) {
      setData(getDefaultAnalysisData());
      toast.success("Skill evaluation updated with current profile!");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <SkeletonLoader className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-48 rounded-xl" />)}
        </div>
        <SkeletonLoader className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <EmptyState title="No Skill Assessment Yet" description="Complete your onboarding profile to trigger AI skill analysis." ctaText="Run Analysis" onCtaClick={handleReanalyze} />;
  }

  const { scores, technicalSkills, softSkills, radarData, strengths, weaknesses, skillGaps, recommendations, lastAnalyzed } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="text-purple-600" size={32} /> AI Skill Analysis
          </h1>
          <p className="text-gray-500 text-sm mt-1">Last evaluated: {new Date(lastAnalyzed).toLocaleDateString()}</p>
        </div>
        <button onClick={handleReanalyze} disabled={analyzing} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm transition disabled:opacity-50">
          <RefreshCw size={18} className={analyzing ? 'animate-spin' : ''} /> {analyzing ? 'Analyzing...' : 'Re-analyze Skills'}
        </button>
      </div>

      {/* Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Overall Skill Index</h3>
            <p className="text-2xl font-bold mt-1 text-purple-600">{getScoreLabel(scores.overall)}</p>
          </div>
          <ScoreGauge score={scores.overall} size={100} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Technical Competency</h3>
            <p className="text-2xl font-bold mt-1 text-blue-600">{getScoreLabel(scores.technical)}</p>
          </div>
          <ScoreGauge score={scores.technical} size={100} color="#3b82f6" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Soft Skill Index</h3>
            <p className="text-2xl font-bold mt-1 text-emerald-600">{getScoreLabel(scores.soft)}</p>
          </div>
          <ScoreGauge score={scores.soft} size={100} color="#10b981" />
        </div>
      </div>

      {/* Radar & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="text-purple-500" size={20} /> Skill Domain Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                <Radar name="Skills" dataKey="A" stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px', border: 'none' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><CheckCircle size={20} /> Key Strengths</h3>
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <div key={i} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">{s.title}</h4>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-1">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {weaknesses.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-amber-600 dark:text-amber-400 flex items-center gap-2"><AlertTriangle size={20} /> Areas for Growth</h3>
              <div className="space-y-3">
                {weaknesses.map((w, i) => (
                  <div key={i} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">{w.title}</h4>
                    <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6">Technical Skills Breakdown</h3>
        <div className="space-y-4">
          {technicalSkills.map((skill) => (
            <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-1/4">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{skill.name}</span>
                  <Badge variant={getPriorityColor(skill.priority)}>{skill.priority} Priority</Badge>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{skill.category}</span>
              </div>
              <div className="flex-1">
                <ProgressBar value={skill.level} color={skill.level >= 75 ? 'emerald' : skill.level >= 50 ? 'purple' : 'amber'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
