import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900/30"></span>
        <span className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent dark:border-primary-500 dark:border-t-transparent"></span>
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 dark:text-gray-300 font-medium animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
