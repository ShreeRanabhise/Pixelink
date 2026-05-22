import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Eye, Share2, ArrowLeft, Tag, Layers, CheckCircle } from 'lucide-react';
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

  // 1. Fetch Single PNG details
  const { data: pngRes, isLoading, isError } = useQuery({
    queryKey: ['pngDetails', slug],
    queryFn: async () => {
      const res = await api.get(`/pngs/${slug}`);
      return res.data;
    },
  });

  const png = pngRes?.data;

  // 2. Fetch Related PNGs in the same category (limit to 4)
  const { data: relatedRes } = useQuery({
    queryKey: ['relatedPngs', png?.category?._id],
    queryFn: async () => {
      const res = await api.get(`/pngs?category=${png.category.slug}&limit=5`);
      // Filter out current PNG
      const filtered = res.data?.data?.filter((p) => p._id !== png._id).slice(0, 4);
      return { data: filtered };
    },
    enabled: !!png?.category?._id,
  });

  const handleDownload = async () => {
    if (!png || isDownloading) return;
    setIsDownloading(true);

    try {
      // 1. Fetch file as blob to prevent browser redirect/open
      const response = await fetch(png.imageUrl);
      if (!response.ok) throw new Error('Image download request failed.');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // 2. Trigger browser download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${png.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // 3. Update downloads count in DB
      await api.post(`/pngs/${png._id}/download`);
      
      // Update local cache query to increment downloads instantly in UI
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

  // Determine bg class based on toggle selection
  const getBgClass = () => {
    if (bgPreview === 'checkerboard') return 'checkerboard-bg';
    if (bgPreview === 'dark') return 'bg-slate-900';
    return 'bg-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <SEO 
        title={`${png.title} Transparent PNG`} 
        description={png.description || `Download free high-resolution ${png.title} transparent PNG cutout.`}
        keywords={png.tags.join(', ')}
        image={png.imageUrl}
      />

      <Link
        to="/"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Image Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative h-[30rem] rounded-3xl ${getBgClass()} flex items-center justify-center p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-inner select-none transition-all duration-300`}>
            <img
              src={png.imageUrl}
              alt={png.title}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />

            {/* Checkerboard controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/60 backdrop-blur-md p-1 rounded-xl flex space-x-1 border border-white/10 shadow-lg">
              <button
                onClick={() => setBgPreview('checkerboard')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white transition-colors ${
                  bgPreview === 'checkerboard' ? 'bg-brand-600' : 'hover:bg-white/10'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setBgPreview('dark')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white transition-colors ${
                  bgPreview === 'dark' ? 'bg-brand-600' : 'hover:bg-white/10'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setBgPreview('light')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white transition-colors ${
                  bgPreview === 'light' ? 'bg-brand-600' : 'hover:bg-white/10'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {png.category && (
              <Link
                to={`/category/${png.category.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 dark:text-brand-400 text-xs font-bold hover:bg-brand-500/20 transition-all"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                {png.category.name}
              </Link>
            )}

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {png.title}
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {png.description || 'Premium background-free transparent cutout. Optimized and ready for inclusion in web layouts, graphic banners, Photoshop work, and mobile applications.'}
            </p>

            {/* Visual Metrics */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/35">
              <div className="text-center py-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Views</p>
                <div className="flex items-center justify-center space-x-1.5 mt-1.5 text-slate-800 dark:text-slate-200">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span className="text-base font-extrabold">{png.views}</span>
                </div>
              </div>
              <div className="text-center py-2 border-l border-slate-200 dark:border-slate-800/50">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Downloads</p>
                <div className="flex items-center justify-center space-x-1.5 mt-1.5 text-slate-800 dark:text-slate-200">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-base font-extrabold">{png.downloads}</span>
                </div>
              </div>
            </div>

            {/* License details */}
            <div className="flex items-start space-x-2.5 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>CC0 Free License:</strong> Completely free for both personal and commercial use. No credit or attribution required.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full inline-flex items-center justify-center px-6 py-4 text-base font-extrabold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-xl shadow-brand-500/20 transition-all ${
                isDownloading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 hover:scale-[1.01]'
              }`}
            >
              <Download className={`w-5 h-5 mr-2.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? 'Downloading File...' : 'Download Transparent PNG'}
            </button>

            <button
              onClick={handleShare}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-slate-300 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Copy Share Link
            </button>
            <AdBanner adSlot="pngdetail_sidebar" format="rectangle" className="mt-8" />
          </div>

          {/* Tags list */}
          {png.tags && png.tags.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/40">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" /> Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {png.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-lg transition-colors font-medium"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related PNGs */}
      <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800/40">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          Related transparent cutouts
        </h2>
        {relatedRes?.data?.length === 0 ? (
          <p className="text-sm text-slate-400">No related transparent files in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedRes?.data ? (
              relatedRes.data.map((rPng) => <PngCard key={rPng._id} png={rPng} />)
            ) : (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        )}
      </section>

      {/* Bottom Ad */}
      <div className="pt-8 pb-4 border-t border-slate-200 dark:border-slate-800/40">
        <AdBanner adSlot="pngdetail_bottom" />
      </div>
    </div>
  );
};

export default PngDetail;
