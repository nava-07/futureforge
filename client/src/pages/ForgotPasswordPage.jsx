import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
// import { forgotPassword } from '../services/authService'; // Assuming you'll import this

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // await forgotPassword(email); // Uncomment when service is ready
      // Mocking API call for now:
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 relative z-10"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/40 rounded-2xl">
              <Zap className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Forgot password?
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Check your email</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We've sent a password reset link to <span className="font-medium text-gray-900 dark:text-gray-300">{email}</span>
            </p>
            <Link
              to="/login"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Back to login
            </Link>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-shadow"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Sending link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
