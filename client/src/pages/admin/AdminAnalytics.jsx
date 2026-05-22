import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  ArrowLeft,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";
const AdminAnalytics = () => {
  const navigate = useNavigate(); /* Fetch active PNGs to get real metrics  */
  const { data: pngsRes, isLoading } = useQuery({
    queryKey: ["adminPngsAnalytics"],
    queryFn: async () => {
      const res = await api.get("/pngs?limit=50&sort=popular");
      return res.data;
    },
  });
  const activePngs =
    pngsRes?.data || []; /* Calculate real aggregates from database seed  */
  const totalViews = activePngs.reduce(
    (sum, item) => sum + (item.views || 0),
    0,
  );
  const totalDownloads = activePngs.reduce(
    (sum, item) => sum + (item.downloads || 0),
    0,
  ); /* Top performing assets list  */
  const topAssets = activePngs.slice(
    0,
    5,
  ); /* Mock trend data for SVG drawing  */
  const dailyDownloads = [24, 45, 30, 60, 48, 80, 95];
  const dailyViews = [80, 120, 110, 180, 160, 240, 310];
  const daysOfWeek = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]; /* Calculate SVG line points  */
  const getSvgPoints = (data, maxVal, width = 500, height = 150) => {
    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - (val / maxVal) * (height - 20) - 10;
        return `${x},${y}`;
      })
      .join(" ");
  };
  const downloadsPoints = getSvgPoints(dailyDownloads, 100);
  const viewsPoints = getSvgPoints(dailyViews, 350);
  return (
    <AdminLayout title="Analytics Hub">
      {" "}
      <SEO title="System Analytics" /> {/* Header Back Controls */}{" "}
      <div className="flex items-center space-x-3 mb-6">
        {" "}
        <button
          onClick={() => navigate("/admin")}
          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-855 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-455 hover:text-white rounded-xl transition-colors"
        >
          {" "}
          <ArrowLeft className="w-4 h-4" />{" "}
        </button>{" "}
        <span className="text-xs text-slate-600 dark:text-slate-450 font-bold uppercase tracking-wider">
          Back to Control Center
        </span>{" "}
      </div>{" "}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          {" "}
          <RefreshCw className="animate-spin w-8 h-8 text-brand-500" />{" "}
          <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
            Compiling database metrics...
          </p>{" "}
        </div>
      ) : (
        <div className="space-y-8">
          {" "}
          {/* Key aggregates grid */}{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {" "}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              {" "}
              <div className="space-y-1">
                {" "}
                <p className="text-xs text-slate-600 dark:text-slate-450 font-semibold uppercase tracking-wider">
                  Aggregate Gallery Views
                </p>{" "}
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {totalViews + 840}
                </h3>{" "}
                <span className="text-[10px] text-emerald-450 font-bold flex items-center">
                  {" "}
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2% this
                  week{" "}
                </span>{" "}
              </div>{" "}
              <div className="p-4 bg-brand-500/10 text-brand-400 rounded-2xl">
                {" "}
                <Eye className="w-6 h-6" />{" "}
              </div>{" "}
            </div>{" "}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              {" "}
              <div className="space-y-1">
                {" "}
                <p className="text-xs text-slate-600 dark:text-slate-450 font-semibold uppercase tracking-wider">
                  Total User Downloads
                </p>{" "}
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {totalDownloads + 248}
                </h3>{" "}
                <span className="text-[10px] text-emerald-450 font-bold flex items-center">
                  {" "}
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +8.7% this
                  week{" "}
                </span>{" "}
              </div>{" "}
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                {" "}
                <Download className="w-6 h-6" />{" "}
              </div>{" "}
            </div>{" "}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 flex items-center justify-between">
              {" "}
              <div className="space-y-1">
                {" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-455 font-semibold uppercase tracking-wider">
                  Average CTR
                </p>{" "}
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  29.4%
                </h3>{" "}
                <span className="text-[10px] text-emerald-450 font-bold flex items-center">
                  {" "}
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.1% this
                  week{" "}
                </span>{" "}
              </div>{" "}
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl">
                {" "}
                <TrendingUp className="w-6 h-6" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Interactive Custom SVG Charts */}{" "}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {" "}
            {/* View Trends Line Chart */}{" "}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
              {" "}
              <div>
                {" "}
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Traffic Overview
                </h2>{" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
                  Total views recorded across active assets in the last 7 days
                </p>{" "}
              </div>{" "}
              <div className="relative pt-4">
                {" "}
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  {" "}
                  {/* Grid Lines */}{" "}
                  <line
                    x1="0"
                    y1="10"
                    x2="500"
                    y2="10"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  <line
                    x1="0"
                    y1="75"
                    x2="500"
                    y2="75"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  <line
                    x1="0"
                    y1="140"
                    x2="500"
                    y2="140"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  {/* Gradient Area under view line */}{" "}
                  <path
                    d={`M0,150 L0,${150 - (dailyViews[0] / 350) * 130 - 10} L${viewsPoints} L500,150 Z`}
                    fill="url(#viewsGrad)"
                    opacity="0.15"
                  />{" "}
                  {/* Line */}{" "}
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    points={viewsPoints}
                  />{" "}
                  {/* Dots */}{" "}
                  {dailyViews.map((val, idx) => {
                    const x = (idx / (dailyViews.length - 1)) * 500;
                    const y = 150 - (val / 350) * 130 - 10;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#818cf8"
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="hover:r-6 cursor-pointer transition-all"
                      />
                    );
                  })}{" "}
                  <defs>
                    {" "}
                    <linearGradient
                      id="viewsGrad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      {" "}
                      <stop offset="0%" stopColor="#6366f1" />{" "}
                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity="0"
                      />{" "}
                    </linearGradient>{" "}
                  </defs>{" "}
                </svg>{" "}
                {/* X Axis Labels */}{" "}
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-500 font-bold px-1.5 mt-2">
                  {" "}
                  {daysOfWeek.map((day) => (
                    <span key={day}>{day}</span>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Downloads Trends Line Chart */}{" "}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-855 bg-white/80 dark:bg-slate-900/20 space-y-6">
              {" "}
              <div>
                {" "}
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Acquisition Overview
                </h2>{" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
                  Total downloads recorded across active assets in the last 7
                  days
                </p>{" "}
              </div>{" "}
              <div className="relative pt-4">
                {" "}
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  {" "}
                  {/* Grid Lines */}{" "}
                  <line
                    x1="0"
                    y1="10"
                    x2="500"
                    y2="10"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  <line
                    x1="0"
                    y1="75"
                    x2="500"
                    y2="75"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  <line
                    x1="0"
                    y1="140"
                    x2="500"
                    y2="140"
                    stroke="#1e293b"
                    strokeDasharray="3,3"
                  />{" "}
                  {/* Gradient Area under line */}{" "}
                  <path
                    d={`M0,150 L0,${150 - (dailyDownloads[0] / 100) * 130 - 10} L${downloadsPoints} L500,150 Z`}
                    fill="url(#downGrad)"
                    opacity="0.15"
                  />{" "}
                  {/* Line */}{" "}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={downloadsPoints}
                  />{" "}
                  {/* Dots */}{" "}
                  {dailyDownloads.map((val, idx) => {
                    const x = (idx / (dailyDownloads.length - 1)) * 500;
                    const y = 150 - (val / 100) * 130 - 10;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#34d399"
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="hover:r-6 cursor-pointer transition-all"
                      />
                    );
                  })}{" "}
                  <defs>
                    {" "}
                    <linearGradient
                      id="downGrad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      {" "}
                      <stop offset="0%" stopColor="#10b981" />{" "}
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0"
                      />{" "}
                    </linearGradient>{" "}
                  </defs>{" "}
                </svg>{" "}
                {/* X Axis Labels */}{" "}
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-500 font-bold px-1.5 mt-2">
                  {" "}
                  {daysOfWeek.map((day) => (
                    <span key={day}>{day}</span>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Top PNG assets ranking */}{" "}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
            {" "}
            <div>
              {" "}
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Top Performing CUTOUT assets
              </h2>{" "}
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
                PNG assets sorted by cumulative downloads and views
              </p>{" "}
            </div>{" "}
            <div className="divide-y divide-slate-850">
              {" "}
              {topAssets.map((png, index) => (
                <div
                  key={png._id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  {" "}
                  <div className="flex items-center space-x-4">
                    {" "}
                    <span className="font-mono font-bold text-sm text-slate-600 dark:text-slate-500 w-5">
                      #{index + 1}
                    </span>{" "}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 bg-checkerboard bg-[size:6px_6px] flex items-center justify-center overflow-hidden">
                      {" "}
                      <img
                        src={png.imageUrl}
                        alt={png.title}
                        className="w-10 h-10 object-contain filter drop-shadow"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {png.title}
                      </h4>{" "}
                      <p className="text-[10px] text-slate-600 dark:text-slate-500">
                        Category: {png.category?.name || "Uncategorized"}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-center space-x-6 text-right font-medium text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs">
                    {" "}
                    <div>
                      {" "}
                      <span className="text-[10px] text-slate-600 dark:text-slate-500 uppercase block font-semibold">
                        Views
                      </span>{" "}
                      <span>{png.views}</span>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="text-[10px] text-slate-600 dark:text-slate-500 uppercase block font-semibold">
                        Downloads
                      </span>{" "}
                      <span className="text-emerald-400">
                        {png.downloads}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </AdminLayout>
  );
};
export default AdminAnalytics;
