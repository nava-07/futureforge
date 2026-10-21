import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PublicLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Rocket size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                FutureForge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
              <a href="#about" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</a>
              <a href="#faq" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">FAQ</a>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-600/30"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <a href="#features" className="text-lg font-medium">Features</a>
                <a href="#about" className="text-lg font-medium">About</a>
                <a href="#faq" className="text-lg font-medium">FAQ</a>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
                <Link to="/login" className="text-lg font-medium">Log in</Link>
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-purple-600 text-white text-center font-medium shadow-lg shadow-purple-600/30"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20 flex-grow">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 group mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg">
                  <Rocket size={18} />
                </div>
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  FutureForge
                </span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                AI-powered skill optimization, resume analysis and personalized career development for students.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/features" className="hover:text-purple-600 dark:hover:text-purple-400">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/about" className="hover:text-purple-600 dark:hover:text-purple-400">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-purple-600 dark:hover:text-purple-400">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 FutureForge. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-slate-400">
              {/* Social placeholders */}
              <a href="#" className="hover:text-purple-600"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
              <a href="#" className="hover:text-purple-600"><span className="sr-only">GitHub</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
