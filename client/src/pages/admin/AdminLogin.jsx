import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ShieldAlert, Sparkles, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /* Redirect if already authenticated and admin */
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin");
    }
  }, [isAuthenticated, isAdmin, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      toast.success("Successfully logged in as Admin!");
      navigate("/admin");
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden bg-grid-pattern bg-[size:40px_40px] text-slate-900 dark:text-white">
      {" "}
      <SEO title="Admin Login" /> {/* Floating Back to Site Link */}{" "}
      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white transition-colors bg-slate-900/50 backdrop-blur border border-slate-300 dark:border-slate-800 px-3.5 py-2 rounded-xl"
      >
        {" "}
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to public site{" "}
      </a>{" "}
      {/* Radial glows */}{" "}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-brand-500/20 blur-[100px] animate-pulse-slow"></div>{" "}
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px]"></div>{" "}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {" "}
        <div className="text-center space-y-2">
          {" "}
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-2">
            {" "}
            <Lock className="w-6 h-6 animate-pulse" />{" "}
          </div>{" "}
          <h1 className="text-3xl font-extrabold tracking-tight">
            PngWorld Admin
          </h1>{" "}
          <p className="text-sm text-slate-600 dark:text-slate-500 dark:text-slate-455">
            Enter your credentials to access the management portal
          </p>{" "}
        </div>{" "}
        <form
          onSubmit={handleSubmit}
          className="glass p-8 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-6 shadow-2xl bg-slate-900/80"
        >
          {" "}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start space-x-3 text-rose-400 text-xs font-semibold">
              {" "}
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />{" "}
              <span>{error}</span>{" "}
            </div>
          )}{" "}
          <div className="space-y-4">
            {" "}
            {/* Email field */}{" "}
            <div className="space-y-2">
              {" "}
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase tracking-wider">
                Email Address
              </label>{" "}
              <div className="relative">
                {" "}
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                  {" "}
                  <Mail className="w-4 h-4" />{" "}
                </div>{" "}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pngworld.com"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-950/50 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Password field */}{" "}
            <div className="space-y-2">
              {" "}
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase tracking-wider">
                Password
              </label>{" "}
              <div className="relative">
                {" "}
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                  {" "}
                  <Lock className="w-4 h-4" />{" "}
                </div>{" "}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-950/50 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {" "}
            {loading ? (
              <>
                {" "}
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>{" "}
                Signing in...{" "}
              </>
            ) : (
              <>
                {" "}
                <Sparkles className="w-4 h-4 mr-2" /> Access Control{" "}
              </>
            )}{" "}
          </button>{" "}
        </form>{" "}
        <p className="text-center text-xs text-slate-600">
          {" "}
          Default seed account:{" "}
          <code className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-1 py-0.5 rounded text-brand-400">
            admin@pngworld.com
          </code>{" "}
          /{" "}
          <code className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-1 py-0.5 rounded text-brand-400">
            admin12345
          </code>{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminLogin;
