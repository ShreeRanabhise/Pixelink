import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, Layers, Search } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO title="Categories" description="Browse free transparent PNG Png's by topic: animals, tech, nature, food, and more." />

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-6 h-6 text-brand-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Explore Categories
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Browse through our curated collections to find the perfect background-free Png's for your design layouts.
        </p>

        {/* Search Bar & Dropdown */}
        <div className="relative max-w-lg mt-8" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-all"
            />
          </div>
          
          {/* Dropdown Suggestions */}
          {showDropdown && searchTerm && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
              {filteredCategories.length > 0 ? (
                <ul className="py-2">
                  {filteredCategories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => navigate(`/category/${cat.slug}`)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-3"
                      >
                        <Layers className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group relative block h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-brand-500/10 transition-all duration-300"
            >
              {/* Image box */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent transition-opacity duration-300"></div>
              
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1 border border-white/20">
                <Layers className="w-3 h-3" />
                <span>Topic</span>
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
