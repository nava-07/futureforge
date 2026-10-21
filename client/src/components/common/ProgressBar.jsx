import { motion } from 'framer-motion';

const ProgressBar = ({ value = 0, label, color = 'bg-primary-500', showPercentage = false }) => {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && <span className="text-sm font-semibold text-gray-900 dark:text-white">{safeValue}%</span>}
        </div>
      )}
      <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
