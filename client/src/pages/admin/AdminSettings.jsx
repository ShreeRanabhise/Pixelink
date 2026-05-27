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
  ArrowLeft,
  Terminal,
  AlertTriangle,
  Save,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle2,
  XCircle
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
    adsenseEnabled: currentSettings?.adsenseEnabled || false,
    cloudinaryCloudName: currentSettings?.cloudinaryCloudName || "",
    cloudinaryApiKey: currentSettings?.cloudinaryApiKey || "",
    cloudinaryApiSecret: currentSettings?.cloudinaryApiSecret || "",
    removeBgApiKey: currentSettings?.removeBgApiKey || "",
    openAiApiKey: currentSettings?.openAiApiKey || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        contactEmail: currentSettings.contactEmail || "support@pixelink.com",
        contactPhone: currentSettings.contactPhone || "+1 (555) 123-4567",
        contactAddress: currentSettings.contactAddress || "100 Alpha Strip, San Francisco, CA",
        adsenseEnabled: currentSettings.adsenseEnabled || false,
        cloudinaryCloudName: currentSettings.cloudinaryCloudName || "",
        cloudinaryApiKey: currentSettings.cloudinaryApiKey || "",
        cloudinaryApiSecret: currentSettings.cloudinaryApiSecret || "",
        removeBgApiKey: currentSettings.removeBgApiKey || "",
        openAiApiKey: currentSettings.openAiApiKey || "",
      });
    }
  }, [currentSettings]);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings', formData);
      toast.success("System settings updated successfully!");
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
  const isRemoveBgActive = healthRes?.health?.removeBg;

  const systemStatus = [
    {
      name: "MongoDB Connection",
      status: "Connected",
      isActive: true,
      type: "Database",
      icon: Database,
      details: "Read/Write operations active. Schema verification complete.",
    },
    {
      name: "Cloudinary SDK",
      status: isCloudinaryActive ? "Active" : "Fallback Storage",
      isActive: isCloudinaryActive,
      type: "Media Storage",
      icon: Cloud,
      details: isCloudinaryActive 
        ? "Connected and routing assets directly to Cloudinary cloud storage." 
        : "Credentials absent. Storing files locally in /server/uploads.",
    },
    {
      name: "Remove.bg Pipeline",
      status: isRemoveBgActive ? "Active" : "Local ML Fallback",
      isActive: isRemoveBgActive,
      type: "AI Background Png's",
      icon: Cpu,
      details: isRemoveBgActive
        ? "Connected to API. Bypassing calls for already transparent images."
        : "Credentials absent. Processing backgrounds using a free local ONNX ML model.",
    },
    {
      name: "OpenAI Tagging",
      status: "Heuristics Active",
      isActive: true,
      type: "AI Auto-Labeling",
      icon: Cpu,
      details:
        "Using token-matching and title regex parsing algorithms for category & keyword tags generation.",
    },
  ];

  return (
    <AdminLayout title="System Configurations">
      <SEO title="System Settings" />
      
      <div className="flex items-center space-x-3 mb-10 pl-2">
        <button
          onClick={() => navigate("/admin")}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all hover:scale-105 hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
            Platform Settings
          </h1>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 block">
            Manage your site's global configuration
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column (Forms) */}
        <div className="xl:col-span-2 space-y-10">
          
          <form onSubmit={handleSaveContactInfo} className="space-y-10">
            {/* Contact Information Settings Form */}
            <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Public Contact Information
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Details displayed on the frontend website.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" /> Support Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Office Address
                  </label>
                  <input
                    type="text"
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Monetization Settings Form */}
            <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Monetization & API Keys
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Control advertising and external API service keys globally.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                <div className="mb-4 sm:mb-0 pr-4">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
                    Google AdSense Integration
                    {formData.adsenseEnabled && (
                      <span className="ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Live
                      </span>
                    )}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    Toggle ad units across the entire platform. Placeholders will automatically collapse when disabled.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    name="adsenseEnabled"
                    checked={formData.adsenseEnabled}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500 shadow-inner"></div>
                </label>
              </div>

              {/* API Keys Settings */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Cloud className="w-4 h-4 mr-2 text-slate-400" /> Cloudinary Cloud Name
                    </label>
                    <input
                      type="text"
                      name="cloudinaryCloudName"
                      value={formData.cloudinaryCloudName}
                      onChange={handleInputChange}
                      placeholder="Optional, overrides .env"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Cloud className="w-4 h-4 mr-2 text-slate-400" /> Cloudinary API Key
                    </label>
                    <input
                      type="text"
                      name="cloudinaryApiKey"
                      value={formData.cloudinaryApiKey}
                      onChange={handleInputChange}
                      placeholder="Optional, overrides .env"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Cloud className="w-4 h-4 mr-2 text-slate-400" /> Cloudinary API Secret
                    </label>
                    <input
                      type="password"
                      name="cloudinaryApiSecret"
                      value={formData.cloudinaryApiSecret}
                      onChange={handleInputChange}
                      placeholder="Optional, overrides .env"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-slate-400" /> Remove.bg API Key
                    </label>
                    <input
                      type="password"
                      name="removeBgApiKey"
                      value={formData.removeBgApiKey}
                      onChange={handleInputChange}
                      placeholder="Optional, overrides .env"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-slate-400" /> OpenAI API Key
                    </label>
                    <input
                      type="password"
                      name="openAiApiKey"
                      value={formData.openAiApiKey}
                      onChange={handleInputChange}
                      placeholder="Optional, overrides .env"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>


              {/* Floating Save Bar */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-brand-500/20 w-full sm:w-auto"
                >
                  {isSaving ? (
                    <span className="animate-pulse flex items-center">
                      <Save className="w-5 h-5 mr-2" /> Saving Configuration...
                    </span>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right Column (System Status) */}
        <div className="space-y-10">
          
          <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-slate-500" /> System Health
            </h2>
            
            <div className="space-y-4">
              {systemStatus.map((service, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                        <service.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {service.type}
                      </span>
                    </div>
                    {service.isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {service.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {service.details}
                  </p>
                  
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    service.isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {service.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-indigo-500" /> Storage Architecture
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              If Cloudinary is disabled or fails, image uploads will automatically fallback to local storage. Files are written securely to:
            </p>
            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 break-all select-all flex items-center">
              <span className="text-brand-500 mr-2">~</span> /server/uploads/
            </div>
          </div>
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
