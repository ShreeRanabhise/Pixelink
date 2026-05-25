import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800/40 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
              Pixelink
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The premier source for completely transparent, high-resolution PNG images. Download free Png's for UI/UX projects, graphic designs, and marketing assets.
            </p>
          </div>

          {/* Quick Explore */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Popular PNGs
                </Link>
              </li>
              <li>
                <Link to="/latest" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Latest Uploads
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines / Upload */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">
              Community
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/submit" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 font-medium">
                  Submit Your PNG
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">
              Licensing & Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-slate-500 dark:text-slate-400 block">
                  Creative Commons Zero (CC0)
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-500 dark:text-slate-400 block">
                  Free for Personal & Commercial Use
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-500 dark:text-slate-400 block">
                  No Attribution Required
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            &copy; {new Date().getFullYear()} Pixelink Inc. All rights reserved. Unauthorized duplication, distribution, or exhibition of this site's material is strictly prohibited. All trademarks and registered trademarks are the property of their respective owners.
          </p>
          <div className="flex space-x-6 flex-shrink-0">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Made with ❤️ for designers worldwide.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
