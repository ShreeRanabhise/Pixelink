import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PngCard = ({ png, onDownloadSuccess, rank }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  let rankStyles = "";
  let rankIconColor = "";

  if (rank === 1) {
    rankStyles = "ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10 scale-[1.02]";
    rankIconColor = "text-yellow-400 bg-yellow-400/20 border-yellow-400/50";
  } else if (rank === 2) {
    rankStyles = "ring-2 ring-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.6)] z-10 scale-[1.01]";
    rankIconColor = "text-slate-200 bg-slate-300/20 border-slate-300/50";
  } else if (rank === 3) {
    rankStyles = "ring-2 ring-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.6)] z-10 scale-[1.01]";
    rankIconColor = "text-amber-500 bg-amber-600/20 border-amber-600/50";
  }

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
      className={`group relative glass border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 aspect-square ${rankStyles}`}
    >
      {rank && rank <= 3 && (
        <div className={`absolute top-0 right-0 m-3 z-20 flex items-center justify-center p-2 rounded-full border backdrop-blur-md shadow-lg transition-opacity duration-300 group-hover:opacity-0 ${rankIconColor}`}>
          <Crown className="w-4 h-4 fill-current" />
        </div>
      )}
      <Link to={`/png/${png.slug}`} className="block w-full h-full">
        {/* Transparent Checkerboard Image Box */}
        <div className="relative w-full h-full checkerboard-bg flex items-center justify-center p-4 select-none overflow-hidden">
          <LazyLoadImage
            src={getThumbnailUrl(png.imageUrl)}
            alt={png.title}
            effect="blur"
            wrapperProps={{
                style: { display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }
            }}
            className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-xl"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 text-white">
            {/* Top row: Category */}
            <div className="flex justify-between items-start translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
              {png.category ? (
                <span className="bg-gradient-brand text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg shadow-brand-500/30 border border-white/20">
                  {png.category.name}
                </span>
              ) : <div />}
              
              {/* Quick Download Action */}
              <button
                onClick={handleQuickDownload}
                disabled={isDownloading}
                className={`p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg transition-all ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90 hover:scale-110 hover:rotate-3'
                }`}
                title="Quick Download"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Bottom row: Title & Stats */}
            <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-base font-black mb-2 line-clamp-2 leading-tight">
                {png.title}
              </h3>
              <div className="flex items-center space-x-4 text-[11px] font-bold text-slate-300">
                <span className="flex items-center bg-white/10 px-2 py-1 rounded-md border border-white/5">
                  <Eye className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  {png.views || 0}
                </span>
                <span className="flex items-center bg-white/10 px-2 py-1 rounded-md border border-white/5">
                  <Download className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  {png.downloads || 0}
                </span>
                <span className="flex items-center bg-rose-500/20 text-rose-300 px-2 py-1 rounded-md border border-rose-500/30">
                  <Heart className="w-3.5 h-3.5 mr-1.5" />
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
