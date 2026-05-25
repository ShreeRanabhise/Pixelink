import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Eye, Share2, ArrowLeft, Heart, Flag, Maximize, FileImage, HardDrive, Calendar, User, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import PngCard from '../components/cards/PngCard';
import SkeletonCard from '../components/loaders/SkeletonCard';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const PngDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [bgPreview, setBgPreview] = useState('checkerboard'); // 'checkerboard' | 'dark' | 'light'
  const [isDownloading, setIsDownloading] = useState(false);
  
  // New States for Redesign
  const [hasLiked, setHasLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0); 
  const [imgResolution, setImgResolution] = useState('Loading...');
  const [fileSize, setFileSize] = useState('Loading...');

  // 1. Fetch Single PNG details
  const { data: pngRes, isLoading, isError } = useQuery({
    queryKey: ['pngDetails', slug],
    queryFn: async () => {
      const res = await api.get(`/pngs/${slug}`);
      return res.data;
    },
  });

  const png = pngRes?.data;

  // 2. Fetch Similar PNGs using the new recommendation algorithm
  const { data: relatedRes } = useQuery({
    queryKey: ['similarPngs', png?._id],
    queryFn: async () => {
      const res = await api.get(`/pngs/${png._id}/similar?limit=5`);
      return { data: res.data.data };
    },
    enabled: !!png?._id,
  });

  // Sync likes with DB on load
  useEffect(() => {
    if (png?.likes !== undefined && localLikes === 0 && !hasLiked) {
      setLocalLikes(png.likes);
    }
  }, [png?.likes, hasLiked, localLikes]);

  // Calculate resolution and size when PNG loads
  useEffect(() => {
    if (png?.imageUrl) {
      // 1. Calculate Resolution
      const img = new Image();
      img.src = png.imageUrl;
      img.onload = () => {
        setImgResolution(`${img.naturalWidth} x ${img.naturalHeight}`);
      };
      img.onerror = () => {
        setImgResolution('Unknown');
      };

      // 2. Calculate File Size
      const fetchSize = async () => {
        try {
          const response = await fetch(png.imageUrl, { method: 'HEAD' });
          const bytes = response.headers.get('content-length');
          if (bytes) {
            const kb = (parseInt(bytes, 10) / 1024).toFixed(0);
            if (kb > 1024) {
              setFileSize(`${(kb / 1024).toFixed(2)} MB`);
            } else {
              setFileSize(`${kb} KB`);
            }
          } else {
            setFileSize('Unknown');
          }
        } catch (error) {
          console.error("Could not fetch file size", error);
          setFileSize('Unknown');
        }
      };
      fetchSize();
    }
  }, [png?.imageUrl]);

  const handleDownload = async () => {
    if (!png || isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(png.imageUrl);
      if (!response.ok) throw new Error('Image download request failed.');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${png.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      await api.post(`/pngs/${png._id}/download`);
      
      queryClient.setQueryData(['pngDetails', slug], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            downloads: oldData.data.downloads + 1,
          },
        };
      });

      toast.success('Download started successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Download failed. Try right clicking the image and saving.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleLike = async () => {
    if (!png) return;
    
    try {
      if (hasLiked) {
        setHasLiked(false);
        setLocalLikes(prev => prev - 1);
        await api.post(`/pngs/${png._id}/like`, { action: 'unlike' });
      } else {
        setHasLiked(true);
        setLocalLikes(prev => prev + 1);
        toast.success('Added to your favorites!');
        await api.post(`/pngs/${png._id}/like`, { action: 'like' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not save like');
      // Revert optimistic update
      setHasLiked(!hasLiked);
      setLocalLikes(prev => hasLiked ? prev + 1 : prev - 1);
    }
  };

  const handleReport = () => {
    toast.success('Thank you, we will review this image.');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mx-auto"></div>
        <p className="text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (isError || !png) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">PNG File Not Found</h2>
        <p className="text-slate-500">The transparent graphic you are looking for might have been removed or updated.</p>
        <Link to="/" className="inline-flex items-center text-brand-500 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
      </div>
    );
  }

  const getBgClass = () => {
    if (bgPreview === 'checkerboard') return 'checkerboard-bg';
    if (bgPreview === 'dark') return 'bg-slate-900';
    return 'bg-white';
  };

  const uploadDate = new Date(png.createdAt).toLocaleDateString('en-GB');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <SEO 
        title={`${png.title} Transparent PNG`} 
        description={png.description || `Download free high-resolution ${png.title} transparent PNG Png's.`}
        keywords={png.tags.join(', ')}
        image={png.imageUrl}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
        <Link to="/" className="hover:text-brand-500 transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-300 dark:text-slate-600" />
        {png.category && (
          <>
            <Link to={`/category/${png.category.slug}`} className="hover:text-brand-500 transition-colors shrink-0">
              {png.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-300 dark:text-slate-600" />
          </>
        )}
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
          {png.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Image Viewer & Tags */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className={`relative w-full aspect-[4/3] rounded-3xl ${getBgClass()} flex items-center justify-center p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-sm select-none transition-all duration-300`}>
            <img
              src={png.imageUrl}
              alt={png.title}
              className="max-h-full max-w-full object-contain drop-shadow-xl z-0"
            />
            
            {/* Watermark Overlay */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none opacity-[0.60] dark:opacity-70"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='25' fill='%23000' font-family='ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Arial' font-weight='900' text-anchor='middle' transform='rotate(-35 90 90)'%3EPixelink%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center center'
              }}
            ></div>

            {/* Checkerboard controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-950/60 backdrop-blur-md p-1 rounded-xl flex space-x-1 border border-slate-200/50 dark:border-white/10 shadow-lg">
              <button
                onClick={() => setBgPreview('checkerboard')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  bgPreview === 'checkerboard' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setBgPreview('dark')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  bgPreview === 'dark' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setBgPreview('light')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  bgPreview === 'light' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          {/* Tags Section below Image */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Tags</h3>
            {png.tags && png.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {png.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-4 py-2 bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-brand-500 text-slate-600 dark:text-slate-300 rounded-full transition-colors font-medium shadow-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No tags available.</p>
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
              {png.title}
            </h1>
            
            {png.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-prose">
                {png.description}
              </p>
            )}

            {/* Inline Stats */}
            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {png.views}</span>
              <span className="flex items-center"><Download className="w-4 h-4 mr-1.5" /> {png.downloads}</span>
              <span className="flex items-center"><Heart className="w-4 h-4 mr-1.5" /> {localLikes}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full inline-flex items-center justify-center px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-lg shadow-rose-500/25 transition-all ${
                isDownloading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 hover:scale-[1.02]'
              }`}
            >
              <Download className={`w-5 h-5 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? 'Downloading...' : 'Download PNG for free'}
            </button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Transparent background HD quality 100% free
            </p>
          </div>

          {/* Ad Container below Download */}
          <AdBanner 
            adSlot="pngdetail_below_download" 
            format="rectangle" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 border-dashed dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[120px]" 
          />

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleLike} className="flex flex-col items-center justify-center px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Heart className={`w-4 h-4 mb-1 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              Like
            </button>
            <button onClick={handleShare} className="flex flex-col items-center justify-center px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="w-4 h-4 mb-1" />
              Share
            </button>
            <button onClick={handleReport} className="flex flex-col items-center justify-center px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Flag className="w-4 h-4 mb-1" />
              Report
            </button>
          </div>

          {/* File Details Table */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">File details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <Maximize className="w-4 h-4 mr-2" /> Resolution
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{imgResolution}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <FileImage className="w-4 h-4 mr-2" /> Format
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">PNG</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <HardDrive className="w-4 h-4 mr-2" /> Size
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{fileSize}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" /> Uploaded
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{uploadDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4 mr-2" /> Uploader
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{png.uploaderName || 'Anonymous'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related PNGs */}
      <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800/40">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          Related transparent Png's
        </h2>
        {relatedRes?.data?.length === 0 ? (
          <p className="text-sm text-slate-400">No related transparent files in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {relatedRes?.data ? (
              relatedRes.data.map((rPng) => <PngCard key={rPng._id} png={rPng} />)
            ) : (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        )}
      </section>

    </div>
  );
};

export default PngDetail;
