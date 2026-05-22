import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* Visual Area */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800/50 w-full"></div>
      
      {/* Metadata Info */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-3/4"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800/50 rounded w-16"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800/50 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
