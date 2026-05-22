import React from 'react';
import { Layers, CheckCircle2, Shield, Heart } from 'lucide-react';
import SEO from '../components/common/SEO';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <SEO title="About Us" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          About PngWorld
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          We build tools to empower creators. PngWorld is a crowd-sourced transparent PNG platform providing crisp, transparent cutouts for visual designs.
        </p>
      </div>

      {/* Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl space-y-4 border-slate-200/50 dark:border-slate-800/40">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Backgrounds</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Every file published on PngWorld is verified to have an alpha channel. No solid white borders, no fake grids.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl space-y-4 border-slate-200/50 dark:border-slate-800/40">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">100% Free CC0</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            All files are listed under Creative Commons Zero (CC0). Download and modify files for personal or corporate branding.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl space-y-4 border-slate-200/50 dark:border-slate-800/40">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl w-fit">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Community First</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Users upload transparent assets anonymously. Administrators review, optimize, tag, and publish them to keep the gallery crisp.
          </p>
        </div>
      </div>

      {/* Mission details */}
      <div className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800/40 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Our Mission</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Design workflows should be frictionless. Searching for a transparent cutout of a product or an animal shouldn't result in clicking links that redirect to spam or download fake PNGs with hardcoded grids. PngWorld is built to offer direct, clean, and instant transparent graphic assets.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          {['Alpha checks', 'Auto-tagging suggestions', 'Vibrant community', 'CC0 licensing'].map((item) => (
            <div key={item} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-350">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
