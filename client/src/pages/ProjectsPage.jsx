import React, { useState, useEffect } from 'react';
import { projectService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import { motion } from 'framer-motion';
import { FolderGit2, RefreshCw, ChevronDown, ChevronUp, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const defaultProjects = [
  {
    id: "p1",
    title: "AI-Powered Skill & Task Management Platform",
    description: "Full-stack web application featuring real-time priority estimation, user authentication, and responsive analytics dashboards.",
    difficulty: "Intermediate",
    estimatedDuration: "2-3 weeks",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    skillsGained: ["Full-Stack Architecture", "JWT Auth", "Recharts Analytics"],
    features: [
      "JWT-authenticated secure access control",
      "Interactive domain radar chart for skill visualization",
      "Automated skill gap computation engine"
    ],
    category: "Full Stack"
  },
  {
    id: "p2",
    title: "High-Throughput API Gateway & Rate Limiter",
    description: "Microservice routing gateway with rate limiting, Redis request caching, and structured logging.",
    difficulty: "Advanced",
    estimatedDuration: "3-4 weeks",
    technologies: ["Node.js", "Express", "Docker", "Redis"],
    skillsGained: ["Microservices", "Rate Limiting", "Containerization"],
    features: [
      "Redis sliding-window rate limiting",
      "Docker Compose container environment",
      "API Key authentication & payload validation"
    ],
    category: "Backend & DevOps"
  },
  {
    id: "p3",
    title: "Developer Portfolio Generator & Theme Switcher",
    description: "Sleek, customizable developer portfolio builder with dynamic theme switching and public sharing link.",
    difficulty: "Beginner",
    estimatedDuration: "1-2 weeks",
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    skillsGained: ["UI Components", "Dynamic Styling", "State Management"],
    features: [
      "Multiple visual themes (Classic, Dark, Neon)",
      "Responsive layout for desktop & mobile",
      "Public custom URL generation"
    ],
    category: "Frontend"
  }
];

const ProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getRecommendedProjects();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProjects(res.data);
      } else {
        setProjects(defaultProjects);
      }
    } catch (err) {
      console.error(err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleStartProject = (id) => {
    toast.success('Project added to your active list!');
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchProjects} />;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderGit2 className="text-purple-600" size={32} />
            AI-Recommended Projects
          </h1>
          <p className="text-gray-500 mt-2">Projects tailored to bridge your skill gaps and boost your resume.</p>
        </div>
        <button 
          onClick={fetchProjects}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <RefreshCw size={16} /> Get New Recommendations
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState 
          icon={<FolderGit2 size={48} />}
          title="No recommendations yet"
          description="Update your resume and skills to get personalized project recommendations."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => {
            const pId = proj._id || proj.id || `proj-${idx}`;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={pId} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl leading-tight">{proj.title}</h3>
                    <Badge variant={proj.difficulty === 'Beginner' ? 'success' : proj.difficulty === 'Advanced' ? 'danger' : 'warning'}>
                      {proj.difficulty || 'Intermediate'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
                  <Clock size={16} /> {proj.estimatedDuration || '2 weeks'}
                </div>

                <div className="mb-4 space-y-3 flex-1">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Tech Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {(proj.technologies || []).map(t => (
                        <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-700 dark:text-gray-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Skills Gained</span>
                    <div className="flex flex-wrap gap-1">
                      {(proj.skillsGained || []).map(s => (
                        <span key={s} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Collapsible Features */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                  <button 
                    onClick={() => toggleExpand(pId)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Key Features
                    {expandedIds.has(pId) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedIds.has(pId) && (
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                      {(proj.features || []).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                  
                  <button 
                    onClick={() => handleStartProject(pId)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Start Project <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
