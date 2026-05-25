import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Settings,
  Database,
  Cloud,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  ArrowLeft,
  Terminal,
  AlertTriangle
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const systemStatus = [
    {
      name: "MongoDB Connection",
      status: "Connected",
      type: "Database",
      icon: Database,
      details: "Read/Write operations active. Schema verification complete.",
      color: "text-emerald-450 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      name: "Cloudinary Storage SDK",
      status: "Fallback Storage Active",
      type: "Media Storage",
      icon: Cloud,
      details:
        "Credentials absent in .env file. Storing files locally in `/server/uploads` folder. Serves statically via express.",
      color: "text-amber-450 border-amber-500/20 bg-amber-500/5",
    },
    {
      name: "Remove.bg API Pipeline",
      status: "NLP Fallback Active",
      type: "AI Background Png's",
      icon: Cpu,
      details:
        "Bypassing active image Png's calls. Saving original transparent uploads directly.",
      color: "text-brand-450 border-brand-500/20 bg-brand-500/5",
    },
    {
      name: "OpenAI Tagging Integration",
      status: "NLP Heuristics Active",
      type: "AI Auto-Labeling",
      icon: Cpu,
      details:
        "Using token-matching and title regex parsing algorithms for category & keyword tags generation.",
      color: "text-brand-450 border-brand-500/20 bg-brand-500/5",
    },
  ];

  return (
    <AdminLayout title="System Configurations">
      <SEO title="System Settings" />
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:text-white rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-600 dark:text-slate-450 font-bold uppercase tracking-wider">
          Back to Control Center
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Credentials & Integrations
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                Status of internal databases, cloud storage assets, and third-party AI services
              </p>
            </div>
            <div className="space-y-4">
              {systemStatus.map((service, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border ${service.color} gap-4`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex-shrink-0 text-slate-900 dark:text-white">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-500 uppercase font-mono font-bold tracking-wider">
                        {service.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {service.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {service.details}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 sm:text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white/5 border-white/10 text-white uppercase tracking-wider">
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-brand-500" /> Active Admin Session
            </h2>
            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-900 pb-2">
                <span>Account Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user?.name || "Administrator"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-900 pb-2">
                <span>Email Identifier</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user?.email || "admin@pixelink.com"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-900 pb-2">
                <span>Access Role</span>
                <span className="font-semibold text-brand-450 uppercase font-mono text-[10px]">
                  SYSTEM ADMIN
                </span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/20 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-indigo-500" /> Local Upload Path
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 leading-relaxed">
              When storing assets locally, files are written directly into:
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-3 rounded-xl font-mono text-[10px] text-slate-400 break-all select-all">
              /server/uploads/
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start space-x-2 text-[10px] text-indigo-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Ensure write permission is active on server directories for clean execution.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminSettings;
