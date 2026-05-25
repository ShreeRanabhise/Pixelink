import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileClock,
  MessageSquare,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  Inbox
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";
import { useAuth } from "../../context/AuthContext";

const InspectorDashboard = () => {
  const { user } = useAuth();

  /* Fetch pending submissions  */
  const { data: pendingRes, isLoading: pendingLoading } = useQuery({
    queryKey: ["adminPendingSubmissionsCount"],
    queryFn: async () => {
      const res = await api.get("/submissions?status=pending");
      return res.data;
    },
  });

  /* Fetch pending messages  */
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      const res = await api.get('/contact-messages');
      return res.data.data;
    },
  });

  const recentSubmissions = pendingRes?.data?.slice(0, 4) || [];
  const totalSubmissionsCount = pendingRes?.total || pendingRes?.data?.length || 0;
  
  const pendingMessagesCount = messages.filter(m => m.status === 'Pending').length;

  const stats = [
    {
      name: "Pending Reviews",
      value: pendingLoading ? "..." : `${totalSubmissionsCount} submissions`,
      icon: FileClock,
      color: totalSubmissionsCount > 0
        ? "from-amber-600/20 to-yellow-600/10 text-amber-400 border-amber-500/30 animate-pulse-slow"
        : "from-slate-800/50 to-slate-900 text-slate-600 dark:text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850",
      description: "User uploads awaiting moderation",
    },
    {
      name: "Unresolved Messages",
      value: messagesLoading ? "..." : `${pendingMessagesCount} messages`,
      icon: Inbox,
      color: pendingMessagesCount > 0
        ? "from-rose-600/20 to-pink-600/10 text-rose-400 border-rose-500/30 animate-pulse-slow"
        : "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/20",
      description: "User queries and suggestions",
    },
  ];

  return (
    <AdminLayout title={`Welcome, ${user?.name || 'Inspector'}`}>
      <SEO title="Inspector Dashboard" /> 

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
        {/* Recent Pending Submissions Table */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Queue: Pending Moderation
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-0.5">
                Review user submissions to maintain gallery quality
              </p>
            </div>
            {totalSubmissionsCount > 0 && (
              <Link
                to="/inspector/submissions"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center"
              >
                <span>Review All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>

          {pendingLoading ? (
            <div className="space-y-3 py-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-850"
                ></div>
              ))}
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
                Queue is clean!
              </p>
              <p className="text-xs text-slate-550 mt-1">
                All user uploads have been reviewed.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 dark:border-slate-850 rounded-2xl divide-y divide-slate-850">
              {recentSubmissions.map((sub) => (
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
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded-full uppercase flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                    <Link
                      to="/inspector/submissions"
                      className="p-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-350 hover:text-white transition-colors"
                      title="Review"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
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
              Workspaces
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/inspector/submissions"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <FileClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Submission Review
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Approve or reject community uploads
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-500" />
              </Link>
              <Link
                to="/inspector/messages"
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-brand-500/30 hover:bg-slate-100 dark:bg-slate-850 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Message Center</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-450">
                      Reply to queries and suggestions
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

export default InspectorDashboard;
