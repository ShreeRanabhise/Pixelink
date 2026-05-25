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

      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to gallery
        </Link>
        <div className="flex items-center space-x-3">
          <Search className="w-7 h-7 text-brand-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Search Results for <span className="text-brand-500">"{query}"</span>
          </h1>
        </div>
        {!isLoading && searchRes && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Found <span className="font-semibold text-slate-700 dark:text-slate-200">{searchRes.totalCount}</span> matching transparent graphics
            </p>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="py-4">
        <AdBanner adSlot="search_top" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {searchRes.data.map((png) => (
              <PngCard key={png._id} png={png} />
            ))}
          </div>

          {/* Pagination */}
          {searchRes.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isFetching}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {page} of {searchRes.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === searchRes.totalPages || isFetching}
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

export default SearchResults;
