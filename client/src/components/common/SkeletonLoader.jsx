const SkeletonLoader = ({ variant = 'text', lines = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm ${className}`}>
            <div className="w-full h-40 skeleton rounded-lg mb-4"></div>
            <div className="w-3/4 h-6 skeleton rounded mb-2"></div>
            <div className="w-1/2 h-4 skeleton rounded"></div>
          </div>
        );
      case 'circle':
        return <div className={`skeleton rounded-full ${className}`} style={{ width: '3rem', height: '3rem' }}></div>;
      case 'chart':
        return <div className={`w-full h-64 skeleton rounded-xl ${className}`}></div>;
      case 'text':
      default:
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className="h-4 skeleton rounded"
                style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }}
              ></div>
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
