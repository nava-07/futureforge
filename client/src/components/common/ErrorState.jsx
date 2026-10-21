import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorState = ({ message = "Something went wrong", onRetry, retry }) => {
  const handleRetry = onRetry || retry;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 my-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Occurred</h3>
      <p className="text-red-600 dark:text-red-300 text-center mb-6 max-w-md">{message}</p>
      
      {handleRetry && (
        <button 
          onClick={handleRetry} 
          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorState;
