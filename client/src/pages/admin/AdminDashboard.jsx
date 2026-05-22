import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  FolderTree,
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
  /* Fetch pending submissions count  */
  const { data: pendingRes, isLoading: pendingLoading } = useQuery({
    queryKey: ["adminPendingSubmissionsCount"],
    queryFn: async () => {
      const res = await api.get("/submissions?status=pending");
      return res.data;
    },
  }); /* Fetch total PNGs  */
  const { data: pngsRes, isLoading: pngsLoading } = useQuery({
    queryKey: ["adminPngsCount"],
    queryFn: async () => {
      const res = await api.get("/pngs?limit=1");
      return res.data;
    },
  }); /* Fetch categories count  */
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

  /* Get recent 4 pending reviews  */
  const recentSubmissions = pendingRes?.data?.slice(0, 4) || [];
  const totalSubmissionsCount =
    pendingRes?.total || pendingRes?.data?.length || 0;
  const totalPngsCount = pngsRes?.total || 0;
  const totalCategoriesCount =
    categoriesRes?.data?.length || 0; 
    
  /* Real analytics totals  */
  const totalDownloads = statsRes?.data?.totalDownloads || 0; 
  const totalViews = statsRes?.data?.totalViews || 0;
  const totalLikes = statsRes?.data?.totalLikes || 0;
  const stats = [
    {
      name: "Active Gallery Size",
      value: pngsLoading ? "..." : `${totalPngsCount} PNGs`,
      icon: Image,
      color: "from-blue-600/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
      description: "Indexed in search & categories",
    },
    {
      name: "Pending Reviews",
      value: pendingLoading ? "..." : `${totalSubmissionsCount} submissions`,
      icon: FileClock,
      color:
        totalSubmissionsCount > 0
          ? "from-amber-600/20 to-yellow-600/10 text-amber-400 border-amber-500/30 animate-pulse-slow"
          : "from-slate-800/50 to-slate-900 text-slate-600 dark:text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850",
      description: "Awaiting moderation approvals",
    },
    {
      name: "PNG Categories",
      value: catsLoading ? "..." : `${totalCategoriesCount} categories`,
      icon: FolderTree,
      color:
        "from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/20",
      description: "Organized folders",
    },
    {
      name: "System Downloads",
      value: statsLoading ? "..." : `${totalDownloads} files`,
      icon: Download,
      color:
        "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/20",
      description: "Accumulated user requests",
    },
  ];
  return (
    <AdminLayout title="Dashboard Hub">
      {" "}
      <SEO title="Admin Control Center" /> {/* Grid of stats */}{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {" "}
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass p-6 rounded-3xl border bg-white/80 dark:bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-40 ${stat.color}`}
          >
            {" "}
            <div className="flex justify-between items-start">
              {" "}
              <div>
                {" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {stat.name}
                </p>{" "}
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {stat.value}
                </h3>{" "}
              </div>{" "}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                {" "}
                <stat.icon className="w-5 h-5" />{" "}
              </div>{" "}
            </div>{" "}
            <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-4">
              {stat.description}
            </p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Recent Pending Submissions Table */}{" "}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pending Moderation
              </h2>{" "}
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-0.5">
                Approve user submissions to include them in the live index
              </p>{" "}
            </div>{" "}
            {totalSubmissionsCount > 0 && (
              <Link
                to="/admin/submissions"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center"
              >
                {" "}
                <span>View All</span>{" "}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />{" "}
              </Link>
            )}{" "}
          </div>{" "}
          {pendingLoading ? (
            <div className="space-y-3 py-6">
              {" "}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-850"
                ></div>
              ))}{" "}
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
              {" "}
              <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />{" "}
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
                Queue is clean!
              </p>{" "}
              <p className="text-xs text-slate-550 mt-1">
                All user uploads have been reviewed.
              </p>{" "}
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 dark:border-slate-850 rounded-2xl divide-y divide-slate-850">
              {" "}
              {recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/10 hover:bg-white/80 dark:bg-slate-900/40 transition-colors"
                >
                  {" "}
                  <div className="flex items-center space-x-3.5">
                    {" "}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden bg-checkerboard bg-[size:6px_6px] flex items-center justify-center">
                      {" "}
                      <img
                        src={sub.imageUrl}
                        alt={sub.title}
                        className="w-10 h-10 object-contain"
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.title}
                      </h4>{" "}
                      <p className="text-xs text-slate-600 dark:text-slate-450 truncate max-w-xs">
                        {sub.tags?.join(", ") || "no tags"}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-center space-x-2">
                    {" "}
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded-full uppercase">
                      {" "}
                      Pending{" "}
                    </span>{" "}
                    <Link
                      to="/admin/submissions"
                      className="p-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-350 hover:text-white transition-colors"
                      title="Review"
                    >
                      {" "}
                      <Eye className="w-4 h-4" />{" "}
                    </Link>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Quick Management Panel */}{" "}
        <div className="space-y-6">
          {" "}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-4">
            {" "}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              System Actions
            </h2>{" "}
            <div className="grid grid-cols-1 gap-3">
              {" "}
              <Link
                to="/admin/upload"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-brand-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    {" "}
                    <UploadCloud className="w-5 h-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-sm font-bold">
                      Direct Admin Upload
                    </p>{" "}
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Bypass queue directly to live catalog
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />{" "}
              </Link>{" "}
              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-purple-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    {" "}
                    <FolderTree className="w-5 h-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-sm font-bold">Category Builder</p>{" "}
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Create & manage taxonomy structures
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />{" "}
              </Link>{" "}
              <Link
                to="/admin/pngs"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-cyan-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    {" "}
                    <Image className="w-5 h-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-sm font-bold">Gallery Audit</p>{" "}
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Update tags, feature, or delete assets
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          {/* Quick Analytics Insight */}{" "}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-4">
            {" "}
            <div className="flex items-center space-x-2">
              {" "}
              <TrendingUp className="w-5 h-5 text-emerald-500" />{" "}
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-500 dark:text-slate-400">
                Popularity Status
              </h2>{" "}
            </div>{" "}
            <div className="space-y-3.5">
              {" "}
              <div>
                {" "}
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  {" "}
                  <span className="text-slate-500">
                    Total System Views
                  </span>{" "}
                  <span className="text-emerald-500">{totalViews}</span>{" "}
                </div>{" "}
                <div className="w-full bg-white dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-300 dark:border-slate-800">
                  {" "}
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: "75%" }}
                  ></div>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  {" "}
                  <span className="text-slate-500">
                    Community Likes
                  </span>{" "}
                  <span className="text-rose-500">{totalLikes}</span>{" "}
                </div>{" "}
                <div className="w-full bg-white dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-300 dark:border-slate-800">
                  {" "}
                  <div
                    className="bg-rose-500 h-1.5 rounded-full"
                    style={{ width: "45%" }}
                  ></div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </AdminLayout>
  );
};
export default AdminDashboard;
