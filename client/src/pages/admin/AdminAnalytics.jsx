import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Download, Eye, ArrowLeft, RefreshCw, ArrowUpRight, Search, MapPin, Link as LinkIcon } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/layout/AdminLayout';
import SEO from '../../components/common/SEO';

const AdminAnalytics = () => {
  const navigate = useNavigate();

  // Fetch all analytics data concurrently
  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['adminAnalyticsOverview'],
    queryFn: async () => {
      const res = await api.get('/analytics/overview');
      return res.data;
    }
  });

  const { data: searchesRes } = useQuery({
    queryKey: ['adminAnalyticsSearches'],
    queryFn: async () => {
      const res = await api.get('/analytics/searches');
      return res.data;
    }
  });

  const { data: geoRes } = useQuery({
    queryKey: ['adminAnalyticsGeo'],
    queryFn: async () => {
      const res = await api.get('/analytics/geo');
      return res.data;
    }
  });

  const { data: sourcesRes } = useQuery({
    queryKey: ['adminAnalyticsSources'],
    queryFn: async () => {
      const res = await api.get('/analytics/sources');
      return res.data;
    }
  });

  const { data: globalStatsRes } = useQuery({
    queryKey: ['adminGlobalStats'],
    queryFn: async () => {
      const res = await api.get('/pngs/stats/global');
      return res.data;
    }
  });

  const isLoading = isOverviewLoading;

  const totalViews = globalStatsRes?.data?.totalViews || 0;
  const totalDownloads = globalStatsRes?.data?.totalDownloads || 0;
  const ctr = totalViews > 0 ? ((totalDownloads / totalViews) * 100).toFixed(1) : '0.0';

  const dailyViews = overviewRes?.dailyViews || [0,0,0,0,0,0,0];
  const dailyDownloads = overviewRes?.dailyDownloads || [0,0,0,0,0,0,0];
  const daysOfWeek = overviewRes?.dates || ['','','','','','',''];

  const maxViews = Math.max(...dailyViews, 10);
  const maxDownloads = Math.max(...dailyDownloads, 10);

  const getSvgPoints = (data, maxVal, width = 500, height = 150) => {
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - (val / maxVal) * (height - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  };

  const downloadsPoints = getSvgPoints(dailyDownloads, maxDownloads);
  const viewsPoints = getSvgPoints(dailyViews, maxViews);

  return (
    <AdminLayout title="Analytics Hub">
      <SEO title="System Analytics" />
      {/* Header Back Controls */}
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={() => navigate('/admin')} className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Back to Control Center</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="animate-spin w-8 h-8 text-brand-500" />
          <p className="text-xs text-slate-500">Compiling real-time database metrics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key aggregates grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Aggregate Gallery Views</p>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalViews.toLocaleString()}</h3>
              </div>
              <div className="p-4 bg-brand-500/10 text-brand-400 rounded-2xl"><Eye className="w-6 h-6" /></div>
            </div>
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total User Downloads</p>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl"><Download className="w-6 h-6" /></div>
            </div>
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Average CTR</p>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{ctr}%</h3>
              </div>
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl"><TrendingUp className="w-6 h-6" /></div>
            </div>
          </div>

          {/* Interactive Custom SVG Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* View Trends Line Chart */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily View Traffic Overview</h2>
                <p className="text-xs text-slate-500">Live views recorded across all assets in the last 7 days</p>
              </div>
              <div className="relative pt-4">
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  <path d={`M0,150 L0,${150 - (dailyViews[0] / maxViews) * 130 - 10} L${viewsPoints} L500,150 Z`} fill="url(#viewsGrad)" opacity="0.15" />
                  <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={viewsPoints} />
                  {dailyViews.map((val, idx) => (
                    <circle key={idx} cx={(idx / (dailyViews.length - 1)) * 500} cy={150 - (val / maxViews) * 130 - 10} r="4" fill="#818cf8" stroke="#0f172a" strokeWidth="2" />
                  ))}
                  <defs>
                    <linearGradient id="viewsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1.5 mt-2">
                  {daysOfWeek.map(day => <span key={day}>{new Date(day).toLocaleDateString('en-US', {weekday: 'short'})}</span>)}
                </div>
              </div>
            </div>

            {/* Downloads Trends Line Chart */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily Downloads Overview</h2>
                <p className="text-xs text-slate-500">Live downloads recorded across all assets in the last 7 days</p>
              </div>
              <div className="relative pt-4">
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  <path d={`M0,150 L0,${150 - (dailyDownloads[0] / maxDownloads) * 130 - 10} L${downloadsPoints} L500,150 Z`} fill="url(#downGrad)" opacity="0.15" />
                  <polyline fill="none" stroke="#10b981" strokeWidth="3" points={downloadsPoints} />
                  {dailyDownloads.map((val, idx) => (
                    <circle key={idx} cx={(idx / (dailyDownloads.length - 1)) * 500} cy={150 - (val / maxDownloads) * 130 - 10} r="4" fill="#34d399" stroke="#0f172a" strokeWidth="2" />
                  ))}
                  <defs>
                    <linearGradient id="downGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1.5 mt-2">
                  {daysOfWeek.map(day => <span key={day}>{new Date(day).toLocaleDateString('en-US', {weekday: 'short'})}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* New Advanced Analytics Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top Searches */}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center mb-4"><Search className="w-4 h-4 mr-2 text-brand-500" /> Top Search Queries</h3>
              <div className="space-y-3">
                {searchesRes?.data?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 capitalize">{item._id}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
                {!searchesRes?.data?.length && <p className="text-xs text-slate-500">No search data yet.</p>}
              </div>
            </div>

            {/* Top Geo */}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center mb-4"><MapPin className="w-4 h-4 mr-2 text-emerald-500" /> Top Countries</h3>
              <div className="space-y-3">
                {geoRes?.data?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 uppercase">{item._id}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
                {!geoRes?.data?.length && <p className="text-xs text-slate-500">No location data yet.</p>}
              </div>
            </div>

            {/* Top Sources */}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center mb-4"><LinkIcon className="w-4 h-4 mr-2 text-purple-500" /> Traffic Sources</h3>
              <div className="space-y-3">
                {sourcesRes?.data?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{item._id}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
                {!sourcesRes?.data?.length && <p className="text-xs text-slate-500">No referer data yet.</p>}
              </div>
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;
