import React from 'react';
import { Layers, CheckCircle2, Shield, Heart } from 'lucide-react';
import SEO from '../components/common/SEO';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <SEO title="About Us" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          About <span className="text-transparent bg-clip-text bg-gradient-brand">Pixelink</span>
        </h1>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We build tools to empower creators. Pixelink is a crowd-sourced transparent PNG platform providing crisp, transparent assets for visual designs.
        </p>
      </div>

      {/* Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] space-y-5 border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">No Backgrounds</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            Every file published on Pixelink is verified to have an alpha channel. No solid white borders, no fake grids.
          </p>
        </div>

        <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] space-y-5 border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">100% Free CC0</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            All files are listed under Creative Commons Zero (CC0). Download and modify files for personal or corporate branding.
          </p>
        </div>

        <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] space-y-5 border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit shadow-inner">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Community First</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            Users upload transparent assets anonymously. Administrators review, optimize, tag, and publish them to keep the gallery crisp.
          </p>
        </div>
      </div>

      {/* Mission details */}
      <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/60 dark:border-slate-800/60 space-y-8 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"></div>
        
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 relative z-10">Our Mission</h2>
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
          Design workflows should be frictionless. Searching for a transparent asset shouldn't result in clicking links that redirect to spam or download fake PNGs with hardcoded grids. Pixelink is built to offer direct, clean, and instant transparent graphic assets.
        </p>
        <div className="flex flex-wrap gap-4 pt-4 relative z-10">
          {['Alpha checks', 'Vibrant community', 'CC0 licensing'].map((item) => (
            <div key={item} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 font-bold bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
