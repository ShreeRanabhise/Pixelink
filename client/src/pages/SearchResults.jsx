import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import api from '../api/axios';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('latest');
  const limit = 12;

  // Fetch search matches
  const { data: searchRes, isLoading, isFetching } = useQuery({
    queryKey: ['searchResultPngs', query, page, sort],
    queryFn: async () => {
      const res = await api.get(`/pngs?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sort=${sort}`);
      return res.data;
    },
    enabled: !!query,
    keepPreviousData: true,
  });

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (searchRes?.totalPages && page < searchRes.totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO title={`Search: "${query}"`} />

      {/* Dynamic Sticky Glass Header */}
      <div className="space-y-4 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 rounded-2xl shadow-sm">
        <Link
          to="/"
          className="inline-flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Back to gallery
        </Link>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl shadow-inner hidden sm:block">
            <Search className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Search Results for <span className="text-transparent bg-clip-text bg-gradient-brand">"{query}"</span>
          </h1>
        </div>
        {!isLoading && searchRes && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Found <span className="text-slate-900 dark:text-white font-extrabold">{searchRes.totalCount}</span> matching assets
            </p>
            <div className="flex items-center space-x-3">
              <label htmlFor="sort" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-sm font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <AdBanner adSlot="search_top" className="py-4" />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !searchRes || searchRes.data.length === 0 ? (
        <div className="glass rounded-3xl p-12 sm:p-16 text-center max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            No Transparent PNGs Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We couldn't find any transparent images matching your search query. Try searching with different keywords, check for typos, or browse active categories.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/categories"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition text-sm"
            >
              Browse Categories
            </Link>
            <Link
              to="/submit"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition text-sm shadow-md"
            >
              Upload PNG Png's
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {searchRes.data.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {searchRes.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-6 pt-10">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-3.5 glass bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-slate-200/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-800/30 px-5 py-2.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                Page {page} of {searchRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === searchRes.totalPages || isFetching}
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

export default SearchResults;
