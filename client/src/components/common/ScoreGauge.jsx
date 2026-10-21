import { motion } from 'framer-motion';

const ScoreGauge = ({ score, label, size = 120, colorClass = 'text-primary-600' }) => {
  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={size * 0.08}
            fill="transparent"
          />
          {/* Foreground circle with animation */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            className={colorClass}
            strokeWidth={size * 0.08}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ stroke: 'currentColor' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score}%</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>}
    </div>
  );
};

export default ScoreGauge;
