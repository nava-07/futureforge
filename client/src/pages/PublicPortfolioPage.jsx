import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { portfolioService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Mail, ExternalLink, Globe } from 'lucide-react';

const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PublicPortfolioPage = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await portfolioService.getPortfolioByUsername(username);
        if (res && res.success) {
          setData(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <EmptyState 
        icon={<Globe size={48} />}
        title="Portfolio Not Found"
        description={`We couldn't find a public portfolio for @${username}.`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-100 to-transparent dark:from-purple-900/20 dark:to-transparent -z-10" />
        
        {data.profileImage && (
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={data.profileImage}
            alt={data.name || username}
            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl mb-6"
          />
        )}
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
        >
          {data.name || username}
        </motion.h1>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-purple-600 dark:text-purple-400 font-medium mb-6"
        >
          {data.headline || 'Software Developer'}
        </motion.h2>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
        >
          {data.bio}
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          {data.contact?.github && (
            <a href={data.contact.github} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
              <GithubIcon size={24} />
            </a>
          )}
          {data.contact?.linkedin && (
            <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
              <LinkedinIcon size={24} />
            </a>
          )}
          {data.contact?.email && (
            <a href={`mailto:${data.contact.email}`} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
              <Mail size={24} />
            </a>
          )}
        </motion.div>
      </section>

      {/* Projects Showcase */}
      {data.projects && data.projects.length > 0 && (
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">Featured Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, i) => (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow group"
                >
                  <div className="p-8">
                    <h4 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{project.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies?.map((tech, ti) => (
                        <span key={ti} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600">
                          <GithubIcon size={16} /> Code
                        </a>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm border-t dark:border-gray-800">
        <p>Powered by <Link to="/" className="font-semibold text-purple-600 hover:underline">FutureForge</Link></p>
      </footer>
    </div>
  );
};

export default PublicPortfolioPage;
