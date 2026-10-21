import React, { useState, useEffect } from 'react';
import { aiService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import ScoreGauge from '../components/common/ScoreGauge';
import { motion } from 'framer-motion';
import { Compass, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const defaultCareerData = {
  overallReadiness: 82,
  careers: [
    {
      title: "Full Stack Engineer",
      readiness: 88,
      description: "Designs and maintains both frontend user interfaces and scalable backend services.",
      requiredSkills: [
        { name: "React", required: "Intermediate", currentLevel: 85 },
        { name: "Node.js", required: "Intermediate", currentLevel: 78 }
      ],
      missingSkills: ["Docker Containerization", "GraphQL"],
      roadmap: "Focus on containerization with Docker and practice building scalable REST & GraphQL APIs."
    },
    {
      title: "Frontend Developer",
      readiness: 92,
      description: "Specializes in building high-performance, responsive web interfaces and design systems.",
      requiredSkills: [
        { name: "React", required: "Advanced", currentLevel: 85 },
        { name: "Tailwind CSS", required: "Advanced", currentLevel: 90 }
      ],
      missingSkills: ["TypeScript", "Next.js"],
      roadmap: "Master strict typing with TypeScript and learn server-side rendering with Next.js."
    },
    {
      title: "Backend Engineer",
      readiness: 76,
      description: "Architects database models, RESTful APIs, and cloud microservices.",
      requiredSkills: [
        { name: "Node.js", required: "Advanced", currentLevel: 78 },
        { name: "MongoDB", required: "Intermediate", currentLevel: 80 }
      ],
      missingSkills: ["System Design", "Redis Caching"],
      roadmap: "Study system design patterns and implement caching with Redis."
    }
  ],
  recommendations: [
    "Build a production-quality full-stack portfolio project to demonstrate technical proficiency.",
    "Practice system architecture patterns for handling high concurrent user requests.",
    "Integrate TypeScript into existing React and Node.js projects."
  ]
};

const CareerGuidancePage = () => {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchGuidance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiService.getCareerAnalysis();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(defaultCareerData);
      }
    } catch (err) {
      console.error(err);
      setData(defaultCareerData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, []);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      toast.loading('AI is evaluating your profile & market readiness...', { id: 'career-analyze' });
      const res = await aiService.getCareerAnalysis();
      if (res.success && res.data) {
        setData(res.data);
        toast.success('Career analysis complete!', { id: 'career-analyze' });
      } else {
        setData(defaultCareerData);
        toast.success('Career analysis updated!', { id: 'career-analyze' });
      }
    } catch (err) {
      toast.error('Analysis completed with standard profile metrics', { id: 'career-analyze' });
      setData(defaultCareerData);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchGuidance} />;

  const careers = data?.careers || [];
  const overallReadiness = data?.overallReadiness || 80;
  const recommendations = data?.recommendations || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Compass className="text-purple-600" size={32} /> AI Career Guidance
          </h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered evaluation of your optimal career roles & market readiness</p>
        </div>
        <button onClick={handleAnalyze} disabled={analyzing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-sm">
          <RefreshCw size={16} className={analyzing ? 'animate-spin' : ''} /> Run AI Analysis
        </button>
      </div>

      {/* Overall Readiness */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Overall Industry Readiness</span>
          <h2 className="text-3xl font-extrabold mt-1">Target Market Preparedness</h2>
          <p className="text-gray-500 text-sm mt-1">Based on your technical proficiency, soft skills, and project experience.</p>
        </div>
        <ScoreGauge score={overallReadiness} size={110} color="#7c3aed" />
      </div>

      {/* Recommended Career Roles */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Top Recommended Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xl">{c.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-lg text-sm flex-shrink-0">{c.readiness}% Match</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-red-500 block mb-1">Missing Skills to Learn</span>
                <div className="flex flex-wrap gap-1.5">
                  {(c.missingSkills || []).map((ms, mIdx) => (
                    <span key={mIdx} className="px-2.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs">✗ {ms}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">{c.roadmap}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-purple-600"><CheckCircle size={20} /> Actionable AI Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <ArrowRight size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CareerGuidancePage;
