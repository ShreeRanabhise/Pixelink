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
      <SEO title="Trending PNGs" description="Browse most popular transparent PNG downloads on PngWorld." />

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-brand-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Trending PNGs
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          The most popular transparent cutouts, vectors, and graphic clipart assets downloaded by our designer community.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingRes?.data?.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {trendingRes?.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {page} of {trendingRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === trendingRes.totalPages || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
