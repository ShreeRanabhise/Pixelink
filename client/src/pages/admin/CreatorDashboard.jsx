import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  FolderTree,
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
      icon: FolderTree,
      color: "from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/20",
      description: "Organized folders available",
    },
  ];

  return (
    <AdminLayout title={`Welcome, ${user?.name || 'Creator'}`}>
      <SEO title="Creator Dashboard" /> 

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass p-6 rounded-3xl border bg-white/80 dark:bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-40 ${stat.color}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {stat.name}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-4">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Uploads Table */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Recent Uploads
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-0.5">
                The latest assets you've contributed to Pixelink
              </p>
            </div>
            {totalUploadsCount > 0 && (
              <Link
                to="/admin/pngs"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>

          {uploadsLoading ? (
            <div className="space-y-3 py-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-850"
                ></div>
              ))}
            </div>
          ) : recentUploads.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
                You haven't uploaded anything yet!
              </p>
              <Link to="/admin/upload" className="mt-4 inline-flex text-sm font-bold text-brand-500 hover:text-brand-600">
                Upload your first PNG
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 dark:border-slate-850 rounded-2xl divide-y divide-slate-850">
              {recentUploads.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/10 hover:bg-white/80 dark:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden bg-checkerboard bg-[size:6px_6px] flex items-center justify-center">
                      <img
                        src={sub.imageUrl}
                        alt={sub.title}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-450 truncate max-w-xs">
                        {sub.tags?.join(", ") || "no tags"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full uppercase flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
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
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/admin/upload"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-brand-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Direct Upload
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Add a new asset to the catalog
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-purple-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Category Builder</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Create & manage taxonomy
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />
              </Link>
              <Link
                to="/admin/pngs"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-cyan-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Image className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Gallery Audit</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Update tags, feature, or delete assets
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreatorDashboard;
