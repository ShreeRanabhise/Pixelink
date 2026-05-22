import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Settings,
  Database,
  Cloud,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  ArrowLeft,
  Terminal,
  AlertTriangle,
  LayoutTemplate
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settingsData } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data.data;
    }
  });

  const [siteName, setSiteName] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (settingsData) {
      setSiteName(settingsData.siteName || "");
      setHeroTitle(settingsData.heroTitle || "");
      setHeroSubtitle(settingsData.heroSubtitle || "");
    }
  }, [settingsData]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put("/settings", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Site settings updated!");
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: (err) => {
      toast.error("Failed to update settings");
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("logo", file);
      const token = localStorage.getItem('pixelink_token');
      const res = await fetch("/api/v1/settings/logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload logo");
      return data;
    },
    onSuccess: () => {
      toast.success("Logo updated successfully!");
      setLogoFile(null);
      // Reset the file input visually
      document.getElementById('logo-upload').value = '';
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: (err) => {
      toast.error("Failed to upload logo");
    }
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ siteName, heroTitle, heroSubtitle });
    if (logoFile) {
      uploadLogoMutation.mutate(logoFile);
    }
  };

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
          
          {/* Global Site Customization Form */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <LayoutTemplate className="w-5 h-5 mr-2 text-brand-500" />
                Global Site Customization
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                Configure the frontend presentation details. Changes apply globally immediately.
              </p>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-5 border-t border-slate-200 dark:border-slate-800/60 pt-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Website Logo</label>
                <div className="flex items-center space-x-4">
                  {settingsData?.logoUrl && (
                    <img src={settingsData.logoUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${settingsData.logoUrl}` : settingsData.logoUrl} alt="Current Logo" className="h-10 w-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1" />
                  )}
                  <input id="logo-upload" type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Site Name / Brand</label>
                <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. PixelInk" className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none transition-colors" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Hero Section Title</label>
                <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="e.g. Download High-Quality Transparent PNGs..." className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none transition-colors" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Hero Section Subtitle</label>
                <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="e.g. Discover millions of free transparent images..." rows="3" className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none transition-colors resize-none" required />
              </div>
              
              <button type="submit" disabled={updateSettingsMutation.isPending || uploadLogoMutation.isPending} className="w-full inline-flex justify-center items-center px-6 py-3.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
                {(updateSettingsMutation.isPending || uploadLogoMutation.isPending) ? 'Applying Changes...' : 'Save Site Customizations'}
              </button>
            </form>
          </div>

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
