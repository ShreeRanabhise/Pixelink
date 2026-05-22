import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';

const LatestUploads = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: latestRes, isLoading, isFetching } = useQuery({
    queryKey: ['latestPngs', page],
    queryFn: async () => {
      const res = await api.get(`/pngs?page=${page}&limit=${limit}`);
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
    if (latestRes?.totalPages && page < latestRes.totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO title="Latest Uploads" description="Browse newest transparent PNG cutouts uploaded on PngWorld." />

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 text-brand-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Latest Uploads
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Fresh transparent cutouts, templates, and icons added to the collection by our creators.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latestRes?.data?.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {latestRes?.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {page} of {latestRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === latestRes.totalPages || isFetching}
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

export default LatestUploads;
