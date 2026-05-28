import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  Folder,
  UploadCloud,
  ArrowRight,
  Eye,
  CheckCircle,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";
import { useAuth } from "../../context/AuthContext";

const CreatorDashboard = () => {
  const { user } = useAuth();

  /* Fetch my uploads */
  const { data: uploadsRes, isLoading: uploadsLoading } = useQuery({
    queryKey: ["creatorUploadsCount"],
    queryFn: async () => {
      const res = await api.get("/pngs/my-uploads");
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

  const recentUploads = uploadsRes?.data?.slice(0, 4) || [];
  const totalUploadsCount = uploadsRes?.count || 0;
  const totalCategoriesCount = categoriesRes?.data?.length || 0; 

  const stats = [
    {
      name: "Your Total Uploads",
      value: uploadsLoading ? "..." : `${totalUploadsCount} PNGs`,
      icon: Image,
      color: "from-blue-600/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
      description: "Live in the gallery",
    },
    {
      name: "Active Categories",
      value: catsLoading ? "..." : `${totalCategoriesCount} categories`,
      icon: Folder,
      color: "from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/20",
      description: "Organized folders available",
    },
  ];

  return (
    <AdminLayout title={`Welcome, ${user?.name || 'Creator'}`}>
      <SEO title="Creator Dashboard" /> 

      {/* Welcome Header */}
      <div className="mb-10 pl-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Creator'} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
          Here is your creator hub. Review your recent uploads, track your contributions, and add new assets to the platform.
        </p>
      </div>

      <div className="space-y-10">
        {/* Grid of stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Uploads Table */}
          <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Your Recent Uploads
                </h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  The latest assets you've contributed to Pixelink
                </p>
              </div>
              {totalUploadsCount > 0 && (
                <Link
                  to="/creator/pngs"
                  className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-sm font-bold transition-colors flex items-center"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              )}
            </div>

            {uploadsLoading ? (
              <div className="space-y-3 py-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-850"
                  ></div>
                ))}
              </div>
            ) : recentUploads.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
                <UploadCloud className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  You haven't uploaded anything yet!
                </p>
                <Link to="/creator/upload" className="mt-4 inline-flex items-center text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2.5 rounded-xl transition-all">
                  Upload your first PNG
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
                {recentUploads.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-4 bg-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 overflow-hidden bg-checkerboard bg-[size:6px_6px] flex items-center justify-center p-2">
                        <img
                          src={sub.imageUrl}
                          alt={sub.title}
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                          {sub.title}
                        </h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-450 truncate max-w-xs">
                          {sub.tags?.join(", ") || "no tags"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Management Panel */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/creator/upload"
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Direct Upload
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Add a new asset
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                </Link>
                
                <Link
                  to="/creator/categories"
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Category Builder
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage taxonomy
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                </Link>
                
                <Link
                  to="/creator/pngs"
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Gallery Audit
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Update or edit assets
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreatorDashboard;
