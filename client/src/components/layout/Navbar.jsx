import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { Menu, X, Sun, Moon, UploadCloud, LayoutDashboard, LogOut, LogIn, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const { data: suggestionsRes } = useQuery({
    queryKey: ['navbarSuggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { data: [] };
      const res = await api.get(`/search?q=${debouncedSearch}`);
      return res.data;
    },
    enabled: debouncedSearch.trim().length > 1,
  });

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/trending', label: 'Trending' },
    { to: '/latest', label: 'Latest' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50 w-full transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={settings.logoUrl} alt={`${settings.siteName} Logo`} className="h-12 w-auto sm:h-[3.6rem] object-contain drop-shadow-sm" />
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-violet-500 to-rose-500 animate-text-gradient bg-clip-text text-transparent">
                {settings.siteName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand-500 ${
                    isActive
                      ? 'text-brand-500 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Search Bar */}
          <div ref={suggestionRef} className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search PNGs..."
                className="w-full pl-10 pr-24 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-slate-200 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500 animate-nav-search-btn hover:opacity-90 text-white text-xs font-semibold rounded-full transition-all flex items-center shadow-sm"
              >
                Search
              </button>
            </form>

            {showSuggestions && suggestionsRes?.data && suggestionsRes.data.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 text-left overflow-hidden z-50">
                <p className="text-[10px] text-slate-400 px-4 pb-1 pt-1 uppercase font-semibold tracking-wider border-b border-slate-100 dark:border-slate-800/65">
                  Suggested PNGs
                </p>
                <div className="max-h-60 overflow-y-auto">
                  {suggestionsRes.data.map((png) => (
                    <button
                      key={png._id}
                      onClick={() => {
                        navigate(`/png/${png.slug}`);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors flex items-center space-x-3"
                    >
                      <img src={png.imageUrl} alt={png.title} className="w-8 h-8 object-contain bg-slate-100 dark:bg-slate-800 rounded p-0.5" />
                      <span className="font-medium text-xs text-slate-700 dark:text-slate-200 truncate">{png.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Public Submit Button */}
            {!isAuthenticated && (
              <Link
                to="/submit"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload PNG
              </Link>
            )}

            {/* Auth Buttons */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/${user.role}`}
                  className="inline-flex items-center p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5 mr-1" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link
                to="/submit"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-md text-base font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 mt-2"
              >
                Upload PNG
              </Link>
            )}
            
            {isAuthenticated && user && (
              <Link
                to={`/${user.role}`}
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-md text-base font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 mt-1"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
