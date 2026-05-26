import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSettings } from "../../context/SettingsContext";
import {
  LayoutDashboard,
  Image,
  FolderTree,
  UploadCloud,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
  Save,
  Users,
  MessageSquare,
  Eye,
  EyeOff,
  ChevronRight,
  Bell
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const roleName = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Administrator";
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePassword, setProfilePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const basePath = `/${user?.role || 'admin'}`;
  
  const navigationGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", href: basePath, icon: LayoutDashboard, roles: ['admin', 'creator', 'inspector'] },
        { name: "Analytics", href: `${basePath}/analytics`, icon: BarChart3, roles: ['admin'] },
      ]
    },
    {
      label: "Content Management",
      items: [
        { name: "Manage PNGs", href: `${basePath}/pngs`, icon: Image, roles: ['admin', 'creator'] },
        { name: "Direct Upload", href: `${basePath}/upload`, icon: UploadCloud, roles: ['admin', 'creator'] },
        { name: "Manage Categories", href: `${basePath}/categories`, icon: FolderTree, roles: ['admin', 'creator'] },
      ]
    },
    {
      label: "Moderation",
      items: [
        { name: "Pending Reviews", href: `${basePath}/submissions`, icon: FileCheck, badge: "reviews", roles: ['admin', 'inspector'] },
        { name: "Messages", href: `${basePath}/messages`, icon: MessageSquare, roles: ['admin', 'inspector'] },
      ]
    },
    {
      label: "System",
      items: [
        { name: "Manage Team", href: `${basePath}/team`, icon: Users, roles: ['admin'] },
        { name: "System Settings", href: `${basePath}/settings`, icon: Settings, roles: ['admin'] },
      ]
    }
  ];

  const filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user?.role || 'admin'))
  })).filter(group => group.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
    }
  }, [user, showProfileModal]);

  const isActive = (path) => {
    if (path === basePath) {
      return location.pathname === basePath || location.pathname === `${basePath}/`;
    }
    return location.pathname.startsWith(path);
  };
  
  // Find Breadcrumb Name
  let breadcrumbName = title || "Dashboard";
  if (!title) {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (item.href === location.pathname || (item.href !== basePath && location.pathname.startsWith(item.href))) {
          breadcrumbName = item.name;
        }
      }
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = { name: profileName, email: profileEmail };
      if (profilePassword) payload.password = profilePassword;
      await api.put("/auth/profile", payload);
      toast.success("Profile updated successfully!");
      setShowProfileModal(false);
      setProfilePassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative selection:bg-brand-500/30">
      
      {/* 
        ========================================================================
        DESKTOP SIDEBAR
        ========================================================================
      */}
      <aside className="hidden md:flex flex-col w-72 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 flex-shrink-0 z-20">
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-3">
          <div className="p-1.5 bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm">
            <img src={settings?.logoUrl || "/logo.png"} alt="Logo" className="w-[34px] h-[34px] object-contain drop-shadow-sm" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Pixelink
            </span>
            <p className="text-[10px] text-brand-500 dark:text-brand-400 font-bold tracking-widest uppercase">
              {roleName} Panel
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
          {filteredGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                {group.label}
              </h3>
              {group.items.map((item) => {
                const Active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      Active 
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25" 
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${Active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 bg-slate-50/50 dark:bg-slate-900/20">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 
        ========================================================================
        MOBILE HEADER & OVERLAY
        ========================================================================
      */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm">
            <img src={settings?.logoUrl || "/logo.png"} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
            {roleName} Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative flex flex-col w-[280px] bg-white dark:bg-slate-900 h-full border-r border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform">
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="font-extrabold text-slate-900 dark:text-white text-base">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              {filteredGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    {group.label}
                  </h3>
                  {group.items.map((item) => {
                    const Active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                          Active ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${Active ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900/50">
              <button onClick={toggleTheme} className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
                {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                <span>Toggle Theme</span>
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 
        ========================================================================
        MAIN CONTENT AREA
        ========================================================================
      */}
      <div className="flex-grow flex flex-col min-w-0 bg-slate-50 dark:bg-transparent relative z-10">
        
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <span className="text-slate-400 dark:text-slate-500 hidden lg:block">Control Panel</span>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 hidden lg:block" />
            <span className="text-slate-900 dark:text-white font-extrabold text-xl">{breadcrumbName}</span>
          </div>
          
          {/* Top Right Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="group inline-flex items-center px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
            </Link>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            
            {/* Profile Trigger */}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 transition-all group shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                {roleName[0]}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">
                  {profileName || roleName}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  View Profile
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile Sub-header Title (since desktop has breadcrumbs) */}
        <div className="md:hidden px-6 py-4 bg-slate-50 dark:bg-transparent">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{breadcrumbName}</h1>
        </div>

        {/* Main Scrolling Content Box */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 
        ========================================================================
        PROFILE EDIT MODAL
        ========================================================================
      */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl glass">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{roleName} Settings</h3>
              <button onClick={() => setShowProfileModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  readOnly={user?.role !== 'admin'}
                  className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-sm font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none dark:text-white transition-all ${user?.role !== 'admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                  readOnly={user?.role !== 'admin'}
                  className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-sm font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none dark:text-white transition-all ${user?.role !== 'admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Update Password {user?.role !== 'admin' ? '' : '(Optional)'}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={profilePassword} 
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 pl-4 pr-12 py-3 text-sm font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full flex justify-center items-center py-3.5 px-4 bg-gradient-brand hover:opacity-90 text-white font-bold rounded-xl shadow-lg mt-8 transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Saving Changes...' : <><Save className="w-4 h-4 mr-2"/> Save Profile</>}
              </button>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center py-3.5 px-4 bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-bold rounded-xl shadow-lg transition-all border border-slate-900 dark:border-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out Securely
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
