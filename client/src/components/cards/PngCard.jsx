import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Heart } from 'lucide-react';
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
      link.download = `${png.slug || 'pixelink-image'}.png`;
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

  const getThumbnailUrl = (url) => {
    if (!url) return '';
    // Optimize Cloudinary URLs on the fly
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/c_limit,w_400,q_auto,f_auto/');
    }
    return url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-[#111827] border border-slate-200/50 dark:border-slate-800/40 rounded-xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-brand-500/5 transition-all duration-300 glow-card aspect-square"
    >
      <Link to={`/png/${png.slug}`} className="block w-full h-full">
        {/* Transparent Checkerboard Image Box */}
        <div className="relative w-full h-full checkerboard-bg flex items-center justify-center p-3 select-none overflow-hidden">
          <img
            src={getThumbnailUrl(png.imageUrl)}
            alt={png.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
            {/* Top row: Category */}
            <div className="flex justify-between items-start">
              {png.category ? (
                <span className="bg-brand-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  {png.category.name}
                </span>
              ) : <div />}
              
              {/* Quick Download Action */}
              <button
                onClick={handleQuickDownload}
                disabled={isDownloading}
                className={`p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'
                }`}
                title="Quick Download"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Bottom row: Title & Stats */}
            <div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
                {png.title}
              </h3>
              <div className="flex items-center space-x-4 text-xs font-medium text-slate-200">
                <span className="flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  {png.views || 0}
                </span>
                <span className="flex items-center">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {png.downloads || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="w-3.5 h-3.5 mr-1" />
                  {png.likes || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PngCard;
