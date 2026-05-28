import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, Layers, Search, Folder } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const Categories = () => {
  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const categories = categoriesRes?.data || [];
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <SEO title="Categories" description="Browse free transparent PNG Png's by topic: animals, tech, nature, food, and more." />

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl shadow-inner">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Explore <span className="text-transparent bg-clip-text bg-gradient-brand">Categories</span>
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Browse through our curated collections to find the perfect background-free Png's for your design layouts.
        </p>

        {/* Search Bar & Dropdown */}
        <div className="relative max-w-lg mt-8" ref={dropdownRef}>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-14 pr-6 py-4 glass bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500/50 shadow-lg transition-all text-lg font-medium placeholder-slate-400"
            />
          </div>
          
          {/* Dropdown Suggestions */}
          {showDropdown && searchTerm && (
            <div className="absolute z-50 w-full mt-3 glass bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl shadow-2xl max-h-72 overflow-y-auto overflow-x-hidden p-2">
              {filteredCategories.length > 0 ? (
                <ul className="space-y-1">
                  {filteredCategories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => navigate(`/category/${cat.slug}`)}
                        className="w-full text-left px-5 py-3.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-2xl text-slate-800 dark:text-slate-200 transition-all flex items-center space-x-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                           <Folder className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="font-bold text-base">{cat.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm font-semibold text-slate-500">
                  No categories found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group relative block h-[220px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 group-hover:from-slate-700 group-hover:to-slate-900 transition-colors duration-500"></div>
              
              {/* Watermark Icon */}
              <div className="absolute -bottom-6 -right-6 text-white opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                <Folder className="w-40 h-40" />
              </div>
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 border border-white/20 shadow-lg">
                <Layers className="w-3 h-3" />
                <span className="uppercase tracking-widest">Topic</span>
              </div>

              {/* Text info overlaid on thumbnail */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h2 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors mb-1.5">
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  {cat.description || "Discover handpicked collections of background-free transparent Png's."}
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-brand-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span>Browse assets</span>
                  <span className="ml-1">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
