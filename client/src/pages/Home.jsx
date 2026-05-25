import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Upload, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import useDebounce from '../hooks/useDebounce';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchVal, setSearchVal] = useState('');
  const debouncedSearch = useDebounce(searchVal, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const observerTarget = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);


  // Fetch Search Suggestions
  const { data: suggestionsRes } = useQuery({
    queryKey: ['suggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { suggestions: [] };
      const res = await api.get(`/search?q=${debouncedSearch}`);
      return res.data;
    },
    enabled: debouncedSearch.trim().length > 1,
  });

  // Infinite query for All PNGs
  const {
    data: allPngsRes,
    isLoading: allLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['allPngs'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/pngs?page=${pageParam}&limit=12`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Fetch Popular PNGs
  const { data: popularRes, isLoading: popLoading } = useQuery({
    queryKey: ['popularPngs'],
    queryFn: async () => {
      const res = await api.get('/pngs?sort=popular&limit=8');
      return res.data;
    },
  });

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (val) => {
    setSearchVal(val);
    navigate(`/search?q=${encodeURIComponent(val)}`);
    setShowSuggestions(false);
  };

  const popularSearches = ['iPhone', 'Cheeseburger', 'Monstera', 'Sakura'];

  return (
    <div className="pb-20">
      <SEO title="Home" />

      {/* 1. Hero / Search Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fac9d9] via-[#fcf1e8] to-[#fce1c2] text-slate-900 dark:bg-none dark:bg-[#090d16] dark:text-white py-8 sm:py-10 flex flex-col justify-center items-center transition-colors duration-500">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-400/10 dark:bg-brand-500/20 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-orange-400/20 dark:bg-purple-500/15 blur-[120px]"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10 space-y-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/60 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            No account needed submit your PNG in seconds
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500">High-Quality</span>
            {' '}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-200/90 via-white/40 to-blue-300/30 dark:from-cyan-100/80 dark:via-white/20 dark:to-blue-200/10"
              style={{ 
                WebkitTextStroke: '1.5px rgba(125, 211, 252, 0.7)', 
                filter: 'drop-shadow(0px 10px 15px rgba(14, 165, 233, 0.2))' 
              }}
            >
              Transparent
            </span>
            <br className="hidden sm:block" />
            {' '}PNG Images <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Free</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            {settings.heroSubtitle}
          </p>

          {/* Search Box Wrapper */}
          <div ref={suggestionRef} className="max-w-2xl mx-auto relative mt-8">
            <form onSubmit={handleSearchSubmit} className="flex shadow-xl rounded-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-1.5 transition-all focus-within:ring-4 focus-within:ring-brand-500/20">
              <div className="flex-grow flex items-center px-4 text-slate-400">
                <Search className="w-5 h-5 mr-2" />
                <input
                  type="text"
                  placeholder="Try diwali diya, ganpati bappa, rakhi..."
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-transparent border-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none py-3 text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 flex items-center"
              >
                Search
              </button>
            </form>

            {/* Auto Suggestions Overlay */}
            {showSuggestions && suggestionsRes?.suggestions && suggestionsRes.suggestions.length > 0 && (
               <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl py-3 text-left overflow-hidden z-50">
                <p className="text-xs text-slate-400 px-4 pb-2 uppercase font-semibold tracking-wider border-b border-slate-100 dark:border-slate-800/65">
                  Suggestions
                </p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
                  {suggestionsRes.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-colors flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick searches */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm mt-6">
            <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center mr-1">
              <TrendingUp className="w-4 h-4 mr-1.5" /> Trending:
            </span>
            {['diwali diya', 'rangoli', 'ganpati bappa', 'modak', 'rakhi', 'festival lights', 'lakshmi'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchVal(keyword);
                  navigate(`/search?q=${encodeURIComponent(keyword)}`);
                }}
                className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm text-xs font-semibold"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-12">

        {/* All PNGs Infinite Feed */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                All PNGs
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Scroll for more fresh uploads from the community
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {allPngsRes?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.map((png) => (
                  <PngCard key={png._id} png={png} />
                ))}
              </React.Fragment>
            ))}
            
            {(allLoading || isFetchingNextPage) && (
              [...Array(4)].map((_, i) => <SkeletonCard key={`sk-${i}`} />)
            )}
          </div>
          
          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="h-10 w-full" />
        </section>

        {/* 4. Popular/Trending PNGs */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Popular Downloads
            </h2>
          </div>

          {popLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {popularRes?.data?.map((png) => (
                <PngCard key={png._id} png={png} />
              ))}
            </div>
          )}
        </section>

        {/* 5. CTA Section - Public upload redirection */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-indigo-700 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-[80px]"></div>
          
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Submit Your PNG and Join Pixelink!
            </h2>
            <p className="text-sm text-brand-100">
              Have background-free Png's images you made? Share them with our community! Your contributions are reviewed by admins and posted for everyone. No account required.
            </p>
          </div>

          <Link
            to="/submit"
            className="flex-shrink-0 inline-flex items-center px-6 py-3.5 text-base font-bold bg-white text-brand-700 hover:bg-slate-50 shadow-lg rounded-2xl transition-all hover:scale-105 active:scale-95 z-10"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Transparent PNG
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
