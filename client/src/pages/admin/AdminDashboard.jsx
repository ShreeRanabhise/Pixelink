import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import {
  Image,
  Folder,
  FileClock,
  Download,
  UploadCloud,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  /* Fetch pending submissions count  */
  const { data: pendingRes, isLoading: pendingLoading } = useQuery({
    queryKey: ["adminPendingSubmissionsCount"],
    queryFn: async () => {
      const res = await api.get("/submissions?status=pending");
      return res.data;
    },
  }); 

  /* Fetch total PNGs  */
  const { data: pngsRes, isLoading: pngsLoading } = useQuery({
    queryKey: ["adminPngsCount"],
    queryFn: async () => {
      const res = await api.get("/pngs?limit=1");
      return res.data;
    },
  }); 

  /* Fetch categories count  */
  const { data: categoriesRes, isLoading: catsLoading } = useQuery({
    queryKey: ["adminCategoriesCount"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  }); 

  /* Fetch global stats */
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["adminGlobalStats"],
    queryFn: async () => {
      const res = await api.get("/pngs/stats/global");
      return res.data;
    },
  });

  /* Fetch Top PNGs */
  const { data: topPngsRes, isLoading: topPngsLoading } = useQuery({
    queryKey: ["adminTopPngs"],
    queryFn: async () => {
      const res = await api.get("/pngs?sort=-downloads&limit=5");
      return res.data;
    },
  });

  /* Fetch Trending Searches */
  const { data: trendingRes, isLoading: trendingLoading } = useQuery({
    queryKey: ["adminTrendingSearches"],
    queryFn: async () => {
      const res = await api.get("/search/trending");
      return res.data;
    },
  });

  /* Get recent 4 pending reviews  */
  const totalSubmissionsCount = pendingRes?.total || pendingRes?.data?.length || 0;
  const totalPngsCount = pngsRes?.totalCount || pngsRes?.total || 0;
  const totalCategoriesCount = categoriesRes?.data?.length || 0; 
    
  /* Real analytics totals  */
  const totalDownloads = statsRes?.data?.totalDownloads || 0; 
  const totalViews = statsRes?.data?.totalViews || 0;
  const totalLikes = statsRes?.data?.totalLikes || 0;
  
  // Calculate dynamic engagement rates (baseline is views)
  const likesPercentage = totalViews > 0 ? Math.min(Math.round((totalLikes / totalViews) * 100), 100) : 0;
  const downloadsPercentage = totalViews > 0 ? Math.min(Math.round((totalDownloads / totalViews) * 100), 100) : 0;
  
  const topPngs = topPngsRes?.data || [];
  const trendingSearches = trendingRes?.trending || [];

  const stats = [
    {
      name: "Active Gallery Size",
      value: pngsLoading ? "..." : `${totalPngsCount}`,
      icon: Image,
      color: "from-blue-600/20 to-cyan-600/10 text-cyan-500 border-cyan-500/20",
      description: "Indexed in search & categories",
    },
    {
      name: "Pending Reviews",
      value: pendingLoading ? "..." : `${totalSubmissionsCount}`,
      icon: FileClock,
      color: totalSubmissionsCount > 0
          ? "from-amber-600/20 to-yellow-600/10 text-amber-500 border-amber-500/30 shadow-amber-500/10 animate-pulse-slow"
          : "from-slate-800/10 to-slate-900/5 text-slate-500 border-slate-200 dark:border-slate-800",
      description: "Awaiting moderation approvals",
    },
    {
      name: "PNG Categories",
      value: catsLoading ? "..." : `${totalCategoriesCount}`,
      icon: Folder,
      color: "from-purple-600/20 to-indigo-600/10 text-purple-500 border-purple-500/20",
      description: "Organized folders",
    },
    {
      name: "System Downloads",
      value: statsLoading ? "..." : `${totalDownloads}`,
      icon: Download,
      color: "from-emerald-600/20 to-teal-600/10 text-emerald-500 border-emerald-500/20",
      description: "Accumulated user requests",
    },
  ];

  return (
    <AdminLayout title="Dashboard Hub">
      <SEO title="Admin Control Center" />
      
      {/* Welcome Header */}
      <div className="mb-10 pl-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
          Here's what's happening with your platform today. Monitor performance, review pending assets, and track your global engagement metrics.
        </p>
      </div>

      <div className="space-y-10">
        {/* Grid of stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`glass p-6 sm:p-7 rounded-[2rem] border bg-white/80 dark:bg-slate-900/40 relative flex flex-col justify-between min-h-[180px] shadow-sm hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ${stat.color}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2">
                    {stat.name}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/5 shadow-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-6">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Analytics Insight */}
          <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-8 flex flex-col justify-center">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Engagement Status</h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Real-time system interactions</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2.5">
                  <span className="text-slate-600 dark:text-slate-400">System Views</span>
                  <span className="text-slate-900 dark:text-white">{totalViews.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-slate-400 dark:bg-slate-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2.5">
                  <span className="text-slate-600 dark:text-slate-400">Downloads Conversion</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 dark:text-emerald-400">{totalDownloads.toLocaleString()}</span>
                    <span className="text-slate-400 dark:text-slate-500">({downloadsPercentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${downloadsPercentage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2.5">
                  <span className="text-slate-600 dark:text-slate-400">Like Conversion</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-600 dark:text-rose-400">{totalLikes.toLocaleString()}</span>
                    <span className="text-slate-400 dark:text-slate-500">({likesPercentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: `${likesPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trending Searches Widget */}
          <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Top Searched Queries</h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">What users are looking for</p>
              </div>
            </div>
            
            {trendingLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"></div>
                ))}
              </div>
            ) : trendingSearches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm font-medium text-slate-500">No search data available yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((query, idx) => (
                  <div key={idx} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-105 transition-transform cursor-default">
                    <span className="text-brand-500 mr-2 opacity-70">#{idx + 1}</span> 
                    {query}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Top Performing PNGs Leaderboard */}
        <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Top Performing Assets</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                The highest downloaded PNGs across your entire catalog
              </p>
            </div>
            <Link to="/admin/pngs" className="px-5 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-sm font-bold transition-colors flex items-center">
              <span>Manage All</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          {topPngsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"></div>
              ))}
            </div>
          ) : topPngs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
              <Image className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No assets available</h3>
              <p className="text-sm text-slate-500">Upload some assets to see top performers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {topPngs.map((png, idx) => (
                <div key={png._id} className="group relative rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col">
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-xl bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-center text-sm font-black shadow-lg">
                    {idx + 1}
                  </div>
                  
                  {/* Image Container */}
                  <div className="aspect-square w-full checkerboard-bg p-6 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={png.imageUrl} 
                      alt={png.title} 
                      className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out" 
                    />
                  </div>
                  
                  {/* Info Footer */}
                  <div className="p-5 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex-1 flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-4" title={png.title}>{png.title}</h4>
                    
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> 
                        {png.downloads}
                      </div>
                      <div className="flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> 
                        {png.views}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
