import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, Layers, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden bg-slate-900 bg-grid-pattern bg-[size:40px_40px] text-white">
      <SEO title="Page Not Found" />

      {/* Glow Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/20 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-[100px]"></div>

      <div className="relative text-center max-w-lg space-y-8 z-10">
        {/* Transparent grid box simulating a missing asset */}
        <div className="mx-auto w-36 h-36 rounded-3xl border border-slate-700/60 flex items-center justify-center bg-checkerboard bg-[size:10px_10px] relative shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/25 via-indigo-600/10 to-transparent"></div>
          <HelpCircle className="w-16 h-16 text-brand-400 animate-bounce" />
          {/* Decorative badges */}
          <span className="absolute top-2 left-2 text-[10px] font-mono bg-rose-500/80 text-white px-1.5 py-0.5 rounded font-bold">404</span>
          <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">alpha: 0</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold tracking-tight">Asset Not Found</h1>
          <p className="text-base text-slate-350 leading-relaxed max-w-md mx-auto">
            The page or transparent Png's you are looking for has been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-3 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center px-5 py-3 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Layers className="w-4 h-4 mr-2" />
            Browse Categories
          </Link>
        </div>

        <div className="pt-4">
          <Link to="/" className="inline-flex items-center text-xs text-slate-450 hover:text-brand-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Go back to the safety of home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
