import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { learningService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import { toast } from 'react-hot-toast';
import { BookOpen, CheckCircle, Circle, RefreshCw } from 'lucide-react';

const LearningPathPage = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pathData, setPathData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await learningService.getLearningPath();
      if (res.success && res.data) {
        setPathData(res.data);
      } else {
        setPathData(getFallbackPath());
      }
    } catch (err) {
      console.error(err);
      setPathData(getFallbackPath());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPath = () => ({
    title: "Full-Stack & System Architecture Roadmap",
    overallProgress: 35,
    months: [
      {
        month: 1,
        title: "Month 1: Advanced API Architecture & Node.js",
        description: "Master Express middleware design, REST standard practices, and async patterns.",
        items: [
          { type: "Course", title: "Node.js Performance Optimization", skill: "Node.js", duration: "2 weeks", completed: true },
          { type: "Project", title: "Build High-Throughput Auth Gateway", skill: "JWT & Security", duration: "2 weeks", completed: true }
        ]
      },
      {
        month: 2,
        title: "Month 2: Frontend State & TypeScript Integration",
        description: "Deep dive into React performance, custom hooks, and strict TypeScript types.",
        items: [
          { type: "Course", title: "Enterprise React with TypeScript", skill: "TypeScript", duration: "2 weeks", completed: false },
          { type: "Project", title: "Migrate Dashboard Analytics to TS", skill: "React & TS", duration: "2 weeks", completed: false }
        ]
      },
      {
        month: 3,
        title: "Month 3: Docker & Cloud Deployment",
        description: "Learn containerization with Docker and cloud hosting environments.",
        items: [
          { type: "Course", title: "Docker Containerization Fundamentals", skill: "DevOps", duration: "2 weeks", completed: false },
          { type: "Certification", title: "Cloud Practitioner Foundations", skill: "AWS / Cloud", duration: "2 weeks", completed: false }
        ]
      }
    ]
  });

  const generatePath = async () => {
    try {
      setGenerating(true);
      toast.loading('AI is crafting your personalized path...', { id: 'gen-path' });
      const res = await learningService.generateLearningPath();
      if (res.success && res.data) {
        setPathData(res.data);
        toast.success('New learning path generated!', { id: 'gen-path' });
      } else {
        setPathData(getFallbackPath());
        toast.success('Generated roadmap!', { id: 'gen-path' });
      }
    } catch (err) {
      toast.error('Failed to generate path', { id: 'gen-path' });
    } finally {
      setGenerating(false);
    }
  };

  const toggleItemCompletion = async (mIndex, iIndex, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await learningService.updateProgress(mIndex, iIndex, newStatus);
      if (res.success && res.data) {
        setPathData(res.data);
        toast.success(newStatus ? 'Item marked as completed!' : 'Item marked in progress');
      } else {
        setPathData(prev => {
          if (!prev) return prev;
          const newMonths = [...prev.months];
          if (newMonths[mIndex]?.items[iIndex]) {
            newMonths[mIndex].items[iIndex].completed = newStatus;
          }
          return { ...prev, months: newMonths };
        });
        toast.success(newStatus ? 'Item marked as completed!' : 'Item marked in progress');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchPath} />;

  const months = pathData?.months || [];
  const progress = pathData?.overallProgress || 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="text-purple-600" size={32} /> AI Learning Path
          </h1>
          <p className="text-gray-500 text-sm mt-1">{pathData?.title || 'Personalized Skill Roadmap'}</p>
        </div>
        <button onClick={generatePath} disabled={generating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
          <RefreshCw size={16} className={generating ? 'animate-spin' : ''} /> Regenerate Path
        </button>
      </div>

      {/* Progress Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span>Overall Completion Roadmap</span>
          <span className="text-purple-600 font-bold text-base">{progress}%</span>
        </div>
        <ProgressBar value={progress} color="purple" />
      </div>

      {/* Timeline Months */}
      <div className="space-y-6">
        {months.map((m, mIdx) => (
          <div key={mIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">{m.title || `Month ${m.month || mIdx + 1}`}</h3>
            <p className="text-sm text-gray-500">{m.description}</p>
            <div className="space-y-3 pt-2">
              {(m.items || []).map((item, iIdx) => (
                <div key={iIdx} onClick={() => toggleItemCompletion(mIdx, iIdx, item.completed)} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${item.completed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    {item.completed ? <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} /> : <Circle className="text-gray-400 flex-shrink-0" size={20} />}
                    <div>
                      <span className={`font-semibold text-sm block ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.title}</span>
                      <span className="text-xs text-gray-400">{item.skill} • {item.duration || '1 week'}</span>
                    </div>
                  </div>
                  <Badge variant={item.completed ? 'success' : 'purple'}>{item.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathPage;
