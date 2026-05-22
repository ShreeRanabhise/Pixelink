import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PngCard = ({ png, onDownloadSuccess }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleQuickDownload = async (e) => {
    e.preventDefault(); // Prevent navigating to PngDetail page
    e.stopPropagation();

    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // 1. Fetch file as blob
      const response = await fetch(png.imageUrl);
      if (!response.ok) throw new Error('Failed to download image from storage server.');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // 2. Create anchor link and download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${png.slug || 'pngworld-image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // 3. Increment download counter on server
      await api.post(`/pngs/${png._id}/download`);

      toast.success('Download started!');
      if (onDownloadSuccess) onDownloadSuccess(png._id);
    } catch (err) {
      console.error('Quick download error:', err);
      toast.error('Download failed. Try opening details page.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-[#111827] border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-brand-500/5 transition-all duration-300 glow-card"
    >
      <Link to={`/png/${png.slug}`}>
        {/* Transparent Checkerboard Image Box */}
        <div className="relative h-48 checkerboard-bg flex items-center justify-center p-6 select-none overflow-hidden">
          <img
            src={png.imageUrl}
            alt={png.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
          />
          
          {/* Quick Overlay details (Views count) */}
          <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="w-3.5 h-3.5" />
            <span>{png.views}</span>
          </div>

          {/* Quick Category badge */}
          {png.category && (
            <span className="absolute top-3 right-3 bg-brand-500/90 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
              {png.category.name}
            </span>
          )}
        </div>

        {/* Info Area */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-500 transition-colors">
              {png.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1">{png.downloads}</span> downloads
            </p>
          </div>

          {/* Quick Download Action */}
          <button
            onClick={handleQuickDownload}
            disabled={isDownloading}
            className={`flex-shrink-0 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-brand-600 hover:border-brand-600 dark:hover:bg-brand-600 dark:hover:border-brand-600 transition-all ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'
            }`}
            title="Quick Download"
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default PngCard;
