import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';

const TrendingPngs = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: trendingRes, isLoading, isFetching } = useQuery({
    queryKey: ['trendingPngs', page],
    queryFn: async () => {
      const res = await api.get(`/pngs?sort=popular&page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (trendingRes?.totalPages && page < trendingRes.totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO title="Trending PNGs" description="Browse most popular transparent PNG downloads on Pixelink." />

      {/* Dynamic Sticky Glass Header */}
      <div className="space-y-4 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl shadow-inner hidden sm:block">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Trending <span className="text-transparent bg-clip-text bg-gradient-brand">PNGs</span>
          </h1>
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          The most popular transparent Png's, vectors, and graphic clipart assets downloaded by our designer community.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {trendingRes?.data?.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {trendingRes?.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-6 pt-10">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-3.5 glass bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-slate-200/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/30 px-5 py-2.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                Page {page} of {trendingRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === trendingRes.totalPages || isFetching}
                className="p-3.5 glass bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-slate-200/60"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingPngs;
