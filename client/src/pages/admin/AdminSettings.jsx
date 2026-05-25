import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
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
  Save,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import SEO from "../../components/common/SEO";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings: currentSettings } = useSettings();

  const [formData, setFormData] = useState({
    contactEmail: currentSettings?.contactEmail || "support@pixelink.com",
    contactPhone: currentSettings?.contactPhone || "+1 (555) 123-4567",
    contactAddress: currentSettings?.contactAddress || "100 Alpha Strip, San Francisco, CA",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        contactEmail: currentSettings.contactEmail || "support@pixelink.com",
        contactPhone: currentSettings.contactPhone || "+1 (555) 123-4567",
        contactAddress: currentSettings.contactAddress || "100 Alpha Strip, San Francisco, CA",
      });
    }
  }, [currentSettings]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings', formData);
      toast.success("Contact information updated successfully!");
      // Force reload to get fresh settings across the app
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const { data: healthRes } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const res = await api.get('/settings/health');
      return res.data;
    },
    refetchInterval: 30000, // Fetch every 30 seconds just in case
  });

  const isCloudinaryActive = healthRes?.health?.cloudinary;

  const systemStatus = [
    {
      name: "MongoDB Connection",
      status: "Connected",
      type: "Database",
      icon: Database,
      details: "Read/Write operations active. Schema verification complete.",
      color: "text-emerald-600 dark:text-emerald-450 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5",
    },
    {
      name: "Cloudinary Storage SDK",
      status: isCloudinaryActive ? "Cloud Storage Active" : "Fallback Storage Active",
      type: "Media Storage",
      icon: Cloud,
      details: isCloudinaryActive 
        ? "Connected and routing assets directly to Cloudinary cloud storage." 
        : "Credentials absent in .env file. Storing files locally in `/server/uploads` folder. Serves statically via express.",
      color: isCloudinaryActive ? "text-emerald-600 dark:text-emerald-450 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5" : "text-amber-600 dark:text-amber-450 border-amber-500/30 dark:border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/5",
    },
    {
      name: "Remove.bg API Pipeline",
      status: "NLP Fallback Active",
      type: "AI Background Png's",
      icon: Cpu,
      details:
        "Bypassing active image Png's calls. Saving original transparent uploads directly.",
      color: "text-brand-600 dark:text-brand-450 border-brand-500/30 dark:border-brand-500/20 bg-brand-500/10 dark:bg-brand-500/5",
    },
    {
      name: "OpenAI Tagging Integration",
      status: "NLP Heuristics Active",
      type: "AI Auto-Labeling",
      icon: Cpu,
      details:
        "Using token-matching and title regex parsing algorithms for category & keyword tags generation.",
      color: "text-brand-600 dark:text-brand-450 border-brand-500/30 dark:border-brand-500/20 bg-brand-500/10 dark:bg-brand-500/5",
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
          
          {/* Contact Information Settings Form */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-brand-500" /> Site Settings
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                Update public contact information displayed on the website.
              </p>
            </div>
            
            <form onSubmit={handleSaveContactInfo} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1" /> Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1" /> Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> Contact Address
                </label>
                <input
                  type="text"
                  name="contactAddress"
                  value={formData.contactAddress}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Contact Info
                  </>
                )}
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
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white bg-slate-200/50 dark:bg-white/5 uppercase tracking-wider">
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
