import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Folder, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const CategoryDetail = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const limit = 12;

  // 1. Fetch current category details
  // Note: we can find category by slug from list of categories
  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const category = categoriesRes?.data?.find((c) => c.slug === slug);

  // 2. Fetch PNGs for this category
  const { data: pngsRes, isLoading, isFetching } = useQuery({
    queryKey: ['categoryPngs', slug, page],
    queryFn: async () => {
      const res = await api.get(`/pngs?category=${slug}&page=${page}&limit=${limit}`);
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
    if (pngsRes?.totalPages && page < pngsRes.totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {category && (
        <SEO
          title={`${category.name} Transparent PNGs`}
          description={`Download free high-quality ${category.name} transparent PNG Png's and clipart.`}
        />
      )}

      {/* Header / Breadcrumb */}
      {/* Category Header */}
      <div className="space-y-4 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Banner image background if category has an image */}
        {category?.image && (
          <div className="absolute inset-0 z-0 pointer-events-none">
             <img src={category.image} className="w-full h-full object-cover object-right" alt="" />
          </div>
        )}

        <div className="relative z-10 space-y-4 flex flex-col items-start">
          <Link
            to="/categories"
            className="inline-flex items-center text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30 dark:border-slate-700/40 shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Back to categories
          </Link>
          <div className="flex items-center space-x-3 bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 dark:border-slate-700/40 shadow-sm inline-flex">
            <div className="p-1.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg hidden sm:block">
              <Folder className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 m-0">
              {category ? <>{category.name} <span className="text-transparent bg-clip-text bg-gradient-brand">Assets</span></> : 'Category Details'}
            </h1>
          </div>
          {category?.description && (
            <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/30 dark:border-slate-700/40 shadow-sm max-w-2xl">
              <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed m-0">
                {category.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PNG Grid list */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pngsRes?.data?.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No transparent PNGs found in this category yet.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition shadow-md"
          >
            Submit the first PNG!
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {pngsRes.data.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {pngsRes.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-6 pt-10">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-3.5 glass bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-slate-200/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/30 px-5 py-2.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                Page {page} of {pngsRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === pngsRes.totalPages || isFetching}
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

export default CategoryDetail;
