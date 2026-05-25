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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {category && (
        <SEO
          title={`${category.name} Transparent PNGs`}
          description={`Download free high-quality ${category.name} transparent PNG Png's and clipart.`}
        />
      )}

      {/* Header / Breadcrumb */}
      <div className="space-y-4">
        <Link
          to="/categories"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to categories
        </Link>
        <div className="flex items-center space-x-3">
          <Folder className="w-7 h-7 text-brand-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {category ? category.name : 'Category Details'}
          </h1>
        </div>
        {category?.description && (
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="py-4">
        <AdBanner adSlot="category_top" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {pngsRes.data.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {pngsRes.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {page} of {pngsRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === pngsRes.totalPages || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom AdSense Banner */}
      <div className="py-8">
        <AdBanner adSlot="category_bottom" />
      </div>
    </div>
  );
};

export default CategoryDetail;
