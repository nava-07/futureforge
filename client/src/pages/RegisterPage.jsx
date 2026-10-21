import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Building, GraduationCap, Calendar, ArrowRight, Loader2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { DEPARTMENTS, DEGREES, YEARS } from '../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    degree: '',
    year: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 1;
    if (pwd.length >= 10) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return Math.min(strength, 4); // 0-4 scale
  };

  const strength = calculatePasswordStrength(formData.password);
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = Object.keys(formData);
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in all fields`);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/onboarding');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Left Decorative Section - Desktop Only */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-bl from-indigo-900 to-violet-800 items-center justify-center overflow-hidden fixed h-screen top-0 left-0">
        {/* Floating Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <motion.div 
            animate={{ 
              y: [0, 40, 0], 
              rotate: [0, -10, 0] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              y: [0, -30, 0], 
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-0 w-72 h-72 bg-violet-400 rounded-full mix-blend-overlay filter blur-3xl"
          />
        </div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Zap className="w-8 h-8 text-violet-200" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">FutureForge</h1>
            </div>
            <h2 className="text-3xl font-semibold mb-6 leading-snug">
              Unlock your true potential
            </h2>
            <p className="text-violet-200 text-lg leading-relaxed mb-8">
              Create an account to discover personalized career paths, AI-driven skill assessments, and opportunities tailored just for you.
            </p>
            
            <div className="space-y-4">
              {[
                "AI-Powered Resume Analysis",
                "Personalized Learning Paths",
                "Industry Readiness Score"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-indigo-100">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:ml-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl py-8"
        >
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FutureForge</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400">Join us to accelerate your career journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Password strength</span>
                      <span className={`font-medium ${strength >= 3 ? 'text-green-500' : strength >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full ${strength >= level ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  College/University
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    placeholder="University Name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                  disabled={isSubmitting}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS?.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Degree */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Degree
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Degree</option>
                    {DEGREES?.map(deg => (
                      <option key={deg} value={deg}>{deg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Year</option>
                    {YEARS?.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
