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
        ? "from-amber-600/20 to-yellow-600/10 text-amber-500 border-amber-500/30 shadow-amber-500/10 animate-pulse-slow"
        : "from-slate-800/10 to-slate-900/5 text-slate-500 border-slate-200 dark:border-slate-800",
      description: "User uploads awaiting moderation",
    },
    {
      name: "Unresolved Messages",
      value: messagesLoading ? "..." : `${pendingMessagesCount} messages`,
      icon: Inbox,
      color: pendingMessagesCount > 0
        ? "from-rose-600/20 to-pink-600/10 text-rose-500 border-rose-500/30 shadow-rose-500/10 animate-pulse-slow"
        : "from-emerald-600/20 to-teal-600/10 text-emerald-500 border-emerald-500/20",
      description: "User queries and suggestions",
    },
  ];

  return (
    <AdminLayout title={`Welcome, ${user?.name || 'Inspector'}`}>
      <SEO title="Inspector Dashboard" /> 

      {/* Welcome Header */}
      <div className="mb-10 pl-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Inspector'} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
          Here is your moderation hub. Review incoming asset submissions from the community and resolve support messages.
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
          {/* Recent Pending Submissions Table */}
          <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Queue: Pending Moderation
                </h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Review user submissions to maintain gallery quality
                </p>
              </div>
              {totalSubmissionsCount > 0 && (
                <Link
                  to="/inspector/submissions"
                  className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-sm font-bold transition-colors flex items-center"
                >
                  <span>Review All</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              )}
            </div>

            {pendingLoading ? (
              <div className="space-y-3 py-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-850"
                  ></div>
                ))}
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Queue is clean!
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  All user uploads have been successfully reviewed.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800 bg-white/50 dark:bg-slate-900/30">
                {recentSubmissions.map((sub) => (
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
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Pending
                      </span>
                      <Link
                        to="/inspector/submissions"
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm"
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
            <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Workspaces
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/inspector/submissions"
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <FileClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Submission Review
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Approve or reject uploads
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                </Link>
                
                <Link
                  to="/inspector/messages"
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Message Center
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        Resolve user queries
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InspectorDashboard;
