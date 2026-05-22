import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
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
} from "lucide-react";
const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Pending Reviews",
      href: "/admin/submissions",
      icon: FileCheck,
      badge: "reviews",
    },
    { name: "Manage PNGs", href: "/admin/pngs", icon: Image },
    { name: "Manage Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Direct Upload", href: "/admin/upload", icon: UploadCloud },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative">
      {" "}
      {/* Sidebar for Desktop */}{" "}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-slate-800 flex-shrink-0">
        {" "}
        <div className="p-6 border-b border-slate-200 dark:border-slate-850 flex items-center space-x-3">
          {" "}
          <div className="p-2 bg-brand-500/10 text-brand-500 rounded-xl">
            {" "}
            <ShieldCheck className="w-6 h-6" />{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 dark:from-white to-slate-600 dark:to-slate-400 bg-clip-text text-transparent">
              PngWorld Admin
            </span>{" "}
            <p className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">
              Control Panel
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {" "}
          {navigation.map((item) => {
            const Active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${Active ? "bg-brand-600 text-white shadow-lg shadow-brand-600/10" : "text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-850"}`}
              >
                {" "}
                <item.icon className="w-5 h-5 flex-shrink-0" />{" "}
                <span>{item.name}</span>{" "}
              </Link>
            );
          })}{" "}
        </nav>{" "}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 space-y-2">
          {" "}
          {/* Quick theme toggler in sidebar */}{" "}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:bg-slate-850 hover:text-white transition-colors"
          >
            {" "}
            <span className="font-semibold">Switch Theme</span>{" "}
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-500" />
            )}{" "}
          </button>{" "}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-450 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            {" "}
            <LogOut className="w-5 h-5 flex-shrink-0" />{" "}
            <span>Sign Out</span>{" "}
          </button>{" "}
        </div>{" "}
      </aside>{" "}
      {/* Mobile Top Bar */}{" "}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850">
        {" "}
        <div className="flex items-center space-x-3">
          {" "}
          <ShieldCheck className="w-5 h-5 text-brand-500" />{" "}
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
            PngWorld Admin
          </span>{" "}
        </div>{" "}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white rounded-xl hover:bg-slate-100 dark:bg-slate-850"
        >
          {" "}
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}{" "}
        </button>{" "}
      </header>{" "}
      {/* Mobile Sidebar overlay */}{" "}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {" "}
          <div
            className="fixed inset-0 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>{" "}
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 h-full border-r border-slate-300 dark:border-slate-800 p-6 z-10 space-y-6">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                Navigation
              </span>{" "}
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white rounded-xl hover:bg-slate-100 dark:bg-slate-850"
              >
                {" "}
                <X className="w-5 h-5" />{" "}
              </button>{" "}
            </div>{" "}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {" "}
              {navigation.map((item) => {
                const Active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${Active ? "bg-brand-600 text-white shadow-lg" : "text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-850"}`}
                  >
                    {" "}
                    <item.icon className="w-5 h-5 flex-shrink-0" />{" "}
                    <span>{item.name}</span>{" "}
                  </Link>
                );
              })}{" "}
            </nav>{" "}
            <div className="border-t border-slate-200 dark:border-slate-850 pt-4 space-y-2">
              {" "}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-450 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              >
                {" "}
                <LogOut className="w-5 h-5 flex-shrink-0" />{" "}
                <span>Sign Out</span>{" "}
              </button>{" "}
            </div>{" "}
          </aside>{" "}
        </div>
      )}{" "}
      {/* Main Content Area */}{" "}
      <div className="flex-grow flex flex-col min-w-0">
        {" "}
        {/* Top Header */}{" "}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-850">
          {" "}
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title || "Control Panel"}
          </h1>{" "}
          <div className="flex items-center space-x-4">
            {" "}
            <Link
              to="/"
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
            >
              {" "}
              <span>Visit Site</span>{" "}
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />{" "}
            </Link>{" "}
            <div className="h-5 w-[1px] bg-slate-100 dark:bg-slate-850"></div>{" "}
            <div className="flex items-center space-x-2">
              {" "}
              <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                {" "}
                {user?.name ? user.name[0] : "A"}{" "}
              </div>{" "}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {user?.name || "Administrator"}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </header>{" "}
        {/* Inner Content scroll */}{" "}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-950/20">
          {" "}
          <div className="max-w-6xl mx-auto space-y-6">
            {" "}
            {/* Header for mobile view since desktop header handles titles */}{" "}
            <div className="md:hidden flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-900">
              {" "}
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {title || "Control Panel"}
              </h2>{" "}
              <Link
                to="/"
                className="text-xs font-semibold text-brand-500 flex items-center"
              >
                {" "}
                <span>Site</span> <ExternalLink className="w-3 h-3 ml-1" />{" "}
              </Link>{" "}
            </div>{" "}
            {children}{" "}
          </div>{" "}
        </main>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminLayout;
