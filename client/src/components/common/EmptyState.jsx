import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  ctaText,
  onCtaClick
}) => {
  const buttonText = actionText || ctaText;
  const buttonClick = onAction || onCtaClick;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      return <Icon size={40} strokeWidth={1.5} />;
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 my-4"
    >
      {Icon && (
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
          {renderIcon()}
        </div>
      )}
      {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>}
      {description && <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">{description}</p>}
      
      {buttonText && buttonClick && (
        <button 
          onClick={buttonClick} 
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition shadow-sm"
        >
          {buttonText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
