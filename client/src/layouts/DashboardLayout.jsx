import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Brain, FileText, Target, FileEdit, Globe, 
  GraduationCap, FolderKanban, Compass, TrendingUp, Settings, 
  Menu, X, Sun, Moon, Bell, Search, LogOut, Rocket, User
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatbot from '../components/chat/AIChatbot';

const sidebarLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Skill Analysis', path: '/skills', icon: Brain },
  { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
  { name: 'Job Matching', path: '/job-matching', icon: Target },
  { name: 'Resume Builder', path: '/resume-builder', icon: FileEdit },
  { name: 'Portfolio Builder', path: '/portfolio-builder', icon: Globe },
  { name: 'Learning Path', path: '/learning-path', icon: GraduationCap },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Career Guidance', path: '/career', icon: Compass },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg">
              <Rocket size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">FutureForge</span>
          </Link>
          <button className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          ))}
          
          <div className="mt-8 mb-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
        
        {/* User preview at bottom of sidebar (optional, here we have it in topbar) */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="max-w-md w-full hidden sm:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources, skills..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                  <User size={16} />
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.name || 'Student'}
                </span>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => setIsProfileMenuOpen(false)}>
                        Account Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      {/* AI Chatbot Widget */}
      <AIChatbot />
    </div>
  );
};

export default DashboardLayout;
