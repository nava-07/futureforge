import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, FileText, Target, Compass, BookOpen, 
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileService, skillService, resumeService, aiService } from '../services';
import { LoadingSpinner, SkeletonLoader, EmptyState, ErrorState, ScoreGauge, ProgressBar, Badge } from '../components/common';
import { getScoreColor, getScoreLabel, formatDate, getPriorityColor } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const mockRadarData = [
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: 'Node.js', A: 75, fullMark: 100 },
  { subject: 'Python', A: 60, fullMark: 100 },
  { subject: 'UI/UX', A: 85, fullMark: 100 },
  { subject: 'Cloud', A: 45, fullMark: 100 },
  { subject: 'DB', A: 70, fullMark: 100 },
];

const mockBarData = [
  { name: 'Communication', score: 85 },
  { name: 'Leadership', score: 70 },
  { name: 'Problem Solving', score: 90 },
  { name: 'Teamwork', score: 80 },
  { name: 'Adaptability', score: 75 },
];

const mockLineData = [
  { name: 'Jan', score: 60 },
  { name: 'Feb', score: 65 },
  { name: 'Mar', score: 68 },
  { name: 'Apr', score: 75 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 88 },
];

const mockPieData = [
  { name: 'Completed', value: 15 },
  { name: 'In Progress', value: 5 },
  { name: 'Remaining', value: 10 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      let profile = null;
      let skills = [];
      let latestResume = null;

      try {
        const profileRes = await profileService.getProfile();
        if (profileRes?.success && profileRes.data) profile = profileRes.data;
      } catch (e) {}

      try {
        const skillsRes = await skillService.getSkills();
        if (skillsRes?.success && skillsRes.data) skills = skillsRes.data || [];
      } catch (e) {}

      try {
        const resumeRes = await resumeService.getLatestAnalysis();
        if (resumeRes?.success && resumeRes.data) latestResume = resumeRes.data;
      } catch (e) {}

      const userTechSkills = profile?.technicalSkills || [];
      const userSoftSkills = profile?.softSkills || [];
      const atsScore = latestResume?.atsScore || 78;

      const overallSkillScore = userTechSkills.length > 0 
        ? Math.round(userTechSkills.reduce((acc, curr) => acc + (curr.level || 50), 0) / userTechSkills.length)
        : 82;

      setDashboardData({
        scores: {
          overall: overallSkillScore,
          ats: atsScore,
          skillGap: Math.max(10, 100 - overallSkillScore),
          readiness: Math.min(95, Math.round((overallSkillScore + atsScore) / 2)),
          learning: 65
        },
        radarSkills: userTechSkills.length > 0
          ? userTechSkills.slice(0, 6).map(s => ({ subject: s.name, A: s.level || 50, fullMark: 100 }))
          : mockRadarData,
        softSkills: userSoftSkills.length > 0
          ? userSoftSkills.slice(0, 5).map(s => ({ name: s.name, score: s.level || 50 }))
          : mockBarData,
        recentActivity: [
          { id: 1, type: 'resume', desc: latestResume ? 'Latest resume analyzed' : 'Profile completed', date: new Date().toISOString(), icon: FileText },
          { id: 2, type: 'skill', desc: `${userTechSkills.length || 5} skills registered`, date: new Date(Date.now() - 86400000).toISOString(), icon: Brain },
          { id: 3, type: 'course', desc: 'Completed "React & Node.js Fundamentals"', date: new Date(Date.now() - 172800000).toISOString(), icon: BookOpen }
        ],
        recommendations: {
          courses: [
            { id: 1, title: 'AWS Cloud Practitioner', difficulty: 'Beginner', skill: 'Cloud' },
            { id: 2, title: 'System Design Interview', difficulty: 'Advanced', skill: 'Architecture' },
            { id: 3, title: 'Advanced CSS and Sass', difficulty: 'Intermediate', skill: 'UI/UX' }
          ],
          projects: [
            { id: 1, title: 'Build a Microservice Architecture', difficulty: 'Advanced', skill: 'Backend' },
            { id: 2, title: 'Create a Serverless App', difficulty: 'Intermediate', skill: 'Cloud' },
            { id: 3, title: 'E-commerce Dashboard', difficulty: 'Intermediate', skill: 'React' }
          ]
        },
        nextAction: userTechSkills.length < 3
          ? "Add more technical skills to your profile to get a personalized AI learning path."
          : "Analyze your resume against current job descriptions to boost your ATS match score."
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonLoader className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => <SkeletonLoader key={i} className="h-40 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader className="h-80 rounded-xl" />
          <SkeletonLoader className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  if (!dashboardData) {
    return <EmptyState title="Complete Your Profile" description="Start by uploading your resume or taking a skill assessment to see your dashboard." ctaText="Get Started" onCtaClick={() => navigate('/onboarding')} />;
  }

  const { scores, radarSkills, softSkills, recentActivity, recommendations, nextAction } = dashboardData;

  const cardConfig = [
    { title: 'Overall Skill Score', score: scores.overall, icon: Brain, gradient: 'from-purple-500 to-indigo-600', trend: 5 },
    { title: 'ATS Resume Score', score: scores.ats, icon: FileText, gradient: 'from-blue-400 to-blue-600', trend: 12 },
    { title: 'Skill Gap Score', score: scores.skillGap, icon: Target, gradient: 'from-orange-400 to-red-500', trend: -2 },
    { title: 'Career Readiness', score: scores.readiness, icon: Compass, gradient: 'from-emerald-400 to-teal-500', trend: 8 },
    { title: 'Learning Progress', score: scores.learning, icon: BookOpen, gradient: 'from-pink-400 to-rose-500', trend: 15 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here is what's happening with your career progression today.</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cardConfig.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center text-sm font-medium ${card.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {Math.abs(card.trend)}%
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{card.score}</span>
              <span className="text-sm text-gray-400">/100</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Best Action */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 opacity-20"><Brain size={150} /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-200 mb-2 font-medium">
              <Target size={20} />
              <span>AI Insight: Your Next Best Action</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold max-w-3xl leading-relaxed">{nextAction}</p>
          </div>
          <button 
            onClick={() => navigate('/resume-analyzer')}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
          >
            Update Resume <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Brain className="text-purple-500" size={20}/> Technical Skills Assessment</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarSkills}>
                <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                <Radar name="Skills" dataKey="A" stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-blue-500" size={20}/> Soft Skills Breakdown</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={softSkills} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {softSkills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-emerald-500" size={20}/> Skill Growth Trajectory</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="text-pink-500" size={20}/> Learning Progress</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
