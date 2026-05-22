import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Upload, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import useDebounce from '../hooks/useDebounce';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const Home = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const debouncedSearch = useDebounce(searchVal, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

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

  // Fetch Categories
  const { data: categoriesRes, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

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

  // Fetch Featured PNGs
  const { data: featuredRes, isLoading: featLoading } = useQuery({
    queryKey: ['featuredPngs'],
    queryFn: async () => {
      const res = await api.get('/pngs?featured=true&limit=8');
      return res.data;
    },
  });

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
    <div className="space-y-20 pb-20">
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Download <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">High-Quality Transparent</span><br />
            PNG Images <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Free</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Discover and share millions of free transparent PNGs across 0+ categories no sign up required.
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <AdBanner adSlot="home_hero_bottom" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-8">
        {/* 2. Categories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Browse by Category
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Find curated assets tailored to your layout needs
              </p>
            </div>
            <Link to="/categories" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {catsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesRes?.data?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="group relative h-40 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75 dark:brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="font-extrabold text-white text-base tracking-tight">{cat.name}</h3>
                    <p className="text-xs text-slate-300 truncate mt-1">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 3. Featured PNGs */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Featured Transparents
            </h2>
          </div>

          {featLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredRes?.data?.map((png) => (
                <PngCard key={png._id} png={png} />
              ))}
            </div>
          )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              Submit Your PNG and Join PngWorld!
            </h2>
            <p className="text-sm text-brand-100">
              Have background-free cutout images you made? Share them with our community! Your contributions are reviewed by admins and posted for everyone. No account required.
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
