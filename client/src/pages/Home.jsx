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

  // Fetch Categories for dynamic count
  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
    staleTime: 600000, // 10 minutes
  });

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

  // Fetch Trending Searches
  const { data: trendingRes } = useQuery({
    queryKey: ['trendingSearches'],
    queryFn: async () => {
      const res = await api.get('/search/trending');
      return res.data;
    },
    staleTime: 60000, // cache for 1 min
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

  const defaultTrending = ['diwali diya', 'rangoli', 'ganpati bappa', 'modak', 'rakhi', 'festival lights', 'lakshmi'];
  const displayTrending = (trendingRes?.trending && trendingRes.trending.length >= 4) 
    ? trendingRes.trending 
    : defaultTrending;

  return (
    <div className="pb-20">
      <SEO title="Home" />

      {/* 1. Hero / Search Banner */}
      <section className="relative z-20 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white py-10 sm:py-16 flex flex-col justify-center items-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sphere 1: Left to Right (Rose) */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-rose-400/20 dark:bg-brand-500/15 blur-[120px] animate-glow-left-right" style={{ animationDelay: '-3s' }}></div>
          
          {/* Sphere 2: Right to Left (Orange) */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-400/20 dark:bg-purple-500/15 blur-[150px] animate-glow-right-left" style={{ animationDelay: '-12s' }}></div>
          
          {/* Sphere 3: Diagonal (Indigo) */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[100px] animate-glow-diagonal" style={{ animationDelay: '-7s' }}></div>
          
          {/* Sphere 4: Reverse Diagonal (Violet) */}
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-violet-400/20 dark:bg-violet-500/15 blur-[110px] animate-glow-diagonal-rev" style={{ animationDelay: '-18s' }}></div>
          
          {/* Sphere 5: Organic Float 1 (Fuchsia) */}
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-fuchsia-400/15 dark:bg-fuchsia-500/10 blur-[90px] animate-glow-float-1" style={{ animationDelay: '-10s' }}></div>
          
          {/* Sphere 6: Organic Float 2 (Amber) */}
          <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-amber-400/15 dark:bg-rose-500/10 blur-[80px] animate-glow-float-2" style={{ animationDelay: '-25s' }}></div>

          {/* Sphere 7: Organic Float 1 (Rose) */}
          <div className="absolute top-1/4 left-1/2 w-[380px] h-[380px] rounded-full bg-rose-400/15 dark:bg-brand-500/10 blur-[100px] animate-glow-float-1" style={{ animationDelay: '-5s' }}></div>
          
          {/* Sphere 8: Diagonal (Rose) */}
          <div className="absolute top-0 right-1/4 w-[420px] h-[420px] rounded-full bg-rose-400/20 dark:bg-brand-500/15 blur-[110px] animate-glow-diagonal" style={{ animationDelay: '-15s' }}></div>

          {/* Sphere 9: Left to Right (Violet) */}
          <div className="absolute top-1/2 left-0 w-[520px] h-[520px] rounded-full bg-violet-400/25 dark:bg-violet-500/15 blur-[120px] animate-glow-left-right" style={{ animationDelay: '-9s' }}></div>
          
          {/* Sphere 10: Organic Float 2 (Violet) */}
          <div className="absolute top-10 right-10 w-[320px] h-[320px] rounded-full bg-violet-400/15 dark:bg-violet-500/10 blur-[80px] animate-glow-float-2" style={{ animationDelay: '-19s' }}></div>

          {/* Sphere 11: Reverse Diagonal (Orange) */}
          <div className="absolute bottom-10 left-10 w-[480px] h-[480px] rounded-full bg-orange-400/20 dark:bg-orange-500/10 blur-[115px] animate-glow-diagonal-rev" style={{ animationDelay: '-22s' }}></div>

          {/* Sphere 12: Organic Float 1 (Orange) */}
          <div className="absolute bottom-1/2 right-1/2 w-[400px] h-[400px] rounded-full bg-orange-400/15 dark:bg-orange-500/10 blur-[95px] animate-glow-float-1" style={{ animationDelay: '-1s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10 space-y-3">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500">High-Quality Transparent</span>
            <br className="hidden sm:block" />
            {' '}PNG Images <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Free</span>
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
            {settings.heroSubtitle?.replace("0+", `${categoriesRes?.data?.length || 0}+`)}
          </p>

          {/* Search Box Wrapper */}
          <div ref={suggestionRef} className="max-w-2xl mx-auto relative mt-6">
            <form onSubmit={handleSearchSubmit} className="flex glass rounded-full overflow-hidden bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 p-2 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-brand-500/20 focus-within:border-brand-500/50">
              <div className="flex-grow flex items-center px-4 text-slate-400">
                <Search className="w-5 h-5 mr-2.5 text-brand-500" />
                <input
                  type="text"
                  placeholder="Try diwali diya, ganpati bappa, rakhi..."
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-transparent border-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium focus:ring-0 focus:outline-none py-2 text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-brand hover:opacity-90 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 flex items-center shadow-lg hover:shadow-brand-500/25 hover:scale-105 active:scale-95 text-base"
              >
                Search
              </button>
            </form>

            {/* Auto Suggestions Overlay */}
            {showSuggestions && suggestionsRes?.data && suggestionsRes.data.length > 0 && (
               <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl py-2 text-left overflow-hidden z-50">
                <p className="text-xs text-slate-400 px-4 pb-2 pt-1 uppercase font-semibold tracking-wider border-b border-slate-100 dark:border-slate-800/65">
                  Suggested PNGs
                </p>
                <div className="max-h-60 overflow-y-auto">
                  {suggestionsRes.data.map((png) => (
                    <button
                      key={png._id}
                      onClick={() => navigate(`/png/${png.slug}`)}
                      className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors flex items-center space-x-3"
                    >
                      <img src={png.imageUrl} alt={png.title} className="w-10 h-10 object-contain bg-slate-100 dark:bg-slate-800 rounded-lg p-1" />
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-200 truncate">{png.title}</span>
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
            {displayTrending.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchVal(keyword);
                  navigate(`/search?q=${encodeURIComponent(keyword)}`);
                }}
                className="px-5 py-2 rounded-full glass bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all shadow-sm text-xs font-bold hover:scale-105"
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
            className="flex-shrink-0 inline-flex items-center px-8 py-4 text-base font-bold bg-white text-brand-700 hover:bg-slate-50 shadow-2xl rounded-2xl transition-all hover:scale-105 active:scale-95 z-10"
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
