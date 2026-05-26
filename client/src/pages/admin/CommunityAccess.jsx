import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ShieldAlert, Sparkles, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const CommunityAccess = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /* Redirect if already authenticated */
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role === 'admin' ? 'admin' : user.role}`);
    }
  }, [isAuthenticated, user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await login(email, password, role);
    if (result.success) {
      toast.success(`Successfully logged in as ${role}!`);
      navigate(`/${role === 'admin' ? 'admin' : role}`);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden bg-grid-pattern bg-[size:40px_40px] text-slate-900 dark:text-white">
      {" "}
      <SEO title="Community Access" /> {/* Floating Back to Site Link */}{" "}
      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center text-xs text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl"
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
            Community Access
          </h1>{" "}
          <p className="text-sm text-slate-600 dark:text-slate-500 dark:text-slate-455">
            Select your role and enter credentials to access your portal
          </p>{" "}
        </div>{" "}
        <form
          onSubmit={handleSubmit}
          className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl bg-white/80 dark:bg-slate-900/80"
        >
          {" "}
          <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-start space-x-3 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>Warning to Public Users: This access portal is restricted to authorized community personnel. Unauthorized access attempts are logged.</span>
          </div>
          
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
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />{" "}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>{" "}
            </div>{" "}
            {/* Role field */}{" "}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase tracking-wider">
                Select Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all appearance-none"
                  required
                >
                  <option value="admin" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Admin</option>
                  <option value="creator" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Creator</option>
                  <option value="inspector" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Inspector</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-600 dark:text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
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

      </div>{" "}
    </div>
  );
};
export default CommunityAccess;
