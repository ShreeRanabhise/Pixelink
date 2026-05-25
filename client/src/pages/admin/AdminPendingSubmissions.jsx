import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  FileClock,
  Eye,
  FolderOpen,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  UserCheck,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const AdminPendingSubmissions = () => {
  const queryClient = useQueryClient();
  const navigate =
    useNavigate(); /* Selected submission ID for full editor view  */
  const [selectedSub, setSelectedSub] =
    useState(null); /* Edit / Override fields  */
  const [revTitle, setRevTitle] = useState("");
  const [revCategoryId, setRevCategoryId] = useState("");
  const [revTags, setRevTags] = useState("");
  const [processing, setProcessing] =
    useState(false); /* Fetch Categories for Review Panel dropdown  */
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  }); /* Fetch Pending Submissions  */
  const { data: submissionsRes, isLoading } = useQuery({
    queryKey: ["adminPendingSubmissions"],
    queryFn: async () => {
      const res = await api.get("/submissions?status=pending");
      return res.data;
    },
  });
  const submissions = submissionsRes?.data || [];
  const handleSelectSubmission = (sub) => {
    setSelectedSub(sub);
    setRevTitle(sub.title);
    setRevCategoryId(sub.category?._id || sub.category || "");
    setRevTags(sub.tags?.join(", ") || "");
  };
  const handleModeration = async (status) => {
    if (!selectedSub) return;
    if (status === "rejected") {
      const confirm = window.confirm(
        "Are you sure you want to REJECT this submission? The file asset will be deleted.",
      );
      if (!confirm) return;
    }
    setProcessing(true);
    try {
      const payload = {
        status,
        title: revTitle.trim(),
        categoryId: revCategoryId,
        tags: revTags,
      };
      await api.put(`/submissions/${selectedSub._id}`, payload);
      if (status === "approved") {
        toast.success("Submission approved and published to active gallery!");
      } else {
        toast.success("Submission rejected and files deleted.");
      }
      queryClient.invalidateQueries(["adminPendingSubmissions"]);
      queryClient.invalidateQueries(["adminPendingSubmissionsCount"]);
      queryClient.invalidateQueries(["adminPngsCount"]);
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Moderation action failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkModeration = async (status) => {
    if (submissions.length === 0) return;
    
    const confirm = window.confirm(
      `Are you sure you want to ${status.toUpperCase()} ALL ${submissions.length} pending submissions?`
    );
    if (!confirm) return;

    setProcessing(true);
    try {
      const ids = submissions.map(sub => sub._id);
      const payload = { status, ids };
      
      const res = await api.post(`/submissions/bulk`, payload);
      toast.success(res.data.message || `Bulk ${status} completed!`);
      
      queryClient.invalidateQueries(["adminPendingSubmissions"]);
      queryClient.invalidateQueries(["adminPendingSubmissionsCount"]);
      queryClient.invalidateQueries(["adminPngsCount"]);
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Bulk moderation action failed");
    } finally {
      setProcessing(false);
    }
  };
  return (
    <AdminLayout title="Pending Submissions Moderator">
      {" "}
      <SEO title="Pending Reviews" /> {/* Header Controls */}{" "}
      <div className="flex items-center space-x-3 mb-6">
        {" "}
        <button
          onClick={() => navigate("/admin")}
          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-855 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:text-white rounded-xl transition-colors"
        >
          {" "}
          <ArrowLeft className="w-4 h-4" />{" "}
        </button>{" "}
        <span className="text-xs text-slate-600 dark:text-slate-450 font-bold uppercase tracking-wider">
          Back to Control Center
        </span>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Submissions List Queue (Left/Center Column) */}{" "}
        <div className="lg:col-span-1 space-y-4">
          {" "}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-white flex items-center">
                {" "}
                Review Queue{" "}
                <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-550/20 text-[10px] text-amber-400 font-extrabold uppercase">
                  {submissions.length} items
                </span>{" "}
              </h2>{" "}
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                Select an item below to begin audit review
              </p>{" "}
            </div>{" "}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                {" "}
                <RefreshCw className="animate-spin w-8 h-8 text-brand-500" />{" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-455">
                  Loading queue...
                </p>{" "}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                {" "}
                <UserCheck className="w-10 h-10 text-slate-400 dark:text-slate-650 mx-auto mb-3" />{" "}
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
                  Moderation Complete!
                </p>{" "}
                <p className="text-xs text-slate-550 mt-1">
                  There are no pending submissions at the moment.
                </p>{" "}
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {" "}
                {submissions.map((sub) => {
                  const isSelected = selectedSub?._id === sub._id;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => handleSelectSubmission(sub)}
                      className={`w-full flex items-center space-x-3.5 p-3 rounded-2xl border text-left transition-all ${isSelected ? "border-brand-500 bg-brand-500/5 shadow-brand-500/5 shadow-md" : "border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/20 hover:bg-white/80 dark:bg-slate-900/20"}`}
                    >
                      {" "}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden bg-checkerboard bg-[size:6px_6px] flex items-center justify-center flex-shrink-0">
                        {" "}
                        <img
                          src={sub.imageUrl}
                          alt={sub.title}
                          className="w-10 h-10 object-contain"
                        />{" "}
                      </div>{" "}
                      <div className="min-w-0 flex-1">
                        {" "}
                        <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
                          {sub.title}
                        </span>{" "}
                        <span className="text-[10px] text-slate-600 dark:text-slate-500 block truncate mt-0.5">
                          {" "}
                          Category: {sub.category?.name || "Loading..."}{" "}
                        </span>{" "}
                      </div>{" "}
                    </button>
                  );
                })}{" "}
              </div>
            )}{" "}
            
            {/* Bulk Actions */}
            {submissions.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleBulkModeration('rejected')}
                  disabled={processing}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Reject All
                </button>
                <button
                  onClick={() => handleBulkModeration('approved')}
                  disabled={processing}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve All
                </button>
              </div>
            )}
          </div>{" "}
        </div>{" "}
        {/* Audit Details Panel (Right Columns) */}{" "}
        <div className="lg:col-span-2">
          {" "}
          {selectedSub ? (
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-855 bg-white/80 dark:bg-slate-900/10 space-y-6">
              {" "}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-855 pb-4 gap-4">
                {" "}
                <div>
                  {" "}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Audit & Refine Parameters
                  </h2>{" "}
                  <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                    Review the graphic and enrich keywords before publishing
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center space-x-4 text-[10px] text-slate-600 dark:text-slate-500 dark:text-slate-400 font-medium">
                  {" "}
                  <span className="flex items-center">
                    {" "}
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-500" />{" "}
                    {new Date(selectedSub.createdAt).toLocaleDateString()}{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {" "}
                {/* Checkboard Preview */}{" "}
                <div className="md:col-span-1">
                  {" "}
                  <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-checkerboard bg-[size:10px_10px] h-48 flex items-center justify-center p-4 relative group shadow-inner">
                    {" "}
                    <img
                      src={selectedSub.imageUrl}
                      alt={selectedSub.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                    />{" "}
                    <a
                      href={selectedSub.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2 right-2 p-2 bg-slate-900/80 hover:bg-white dark:bg-slate-900 rounded-xl text-slate-350 hover:text-white transition-colors border border-slate-300 dark:border-slate-800"
                      title="View Full Resolution"
                    >
                      {" "}
                      <Eye className="w-3.5 h-3.5" />{" "}
                    </a>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Metadata refinement */}{" "}
                <div className="md:col-span-2 space-y-4">
                  {" "}
                  <div className="space-y-1.5">
                    {" "}
                    <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Refined Title
                    </label>{" "}
                    <input
                      type="text"
                      value={revTitle}
                      onChange={(e) => setRevTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:outline-none"
                    />{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    <div className="space-y-1.5">
                      {" "}
                      <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Assign Category
                      </label>{" "}
                      <select
                        value={revCategoryId}
                        onChange={(e) => setRevCategoryId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none"
                      >
                        {" "}
                        <option value="">Select Category</option>{" "}
                        {categoriesRes?.data?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {" "}
                            {c.name}{" "}
                          </option>
                        ))}{" "}
                      </select>{" "}
                    </div>{" "}
                    <div className="space-y-1.5">
                      {" "}
                      <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Indexed Tags (comma separated)
                      </label>{" "}
                      <input
                        type="text"
                        value={revTags}
                        onChange={(e) => setRevTags(e.target.value)}
                        placeholder="e.g. apple, fruit, organic"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:outline-none"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Submitter Info and Action Buttons */}{" "}
              <div className="pt-6 border-t border-slate-855 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {" "}
                <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-500">
                  {" "}
                  <span>Submitter IP:</span>{" "}
                  <code className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                    {" "}
                    {selectedSub.submitterIP}{" "}
                  </code>{" "}
                </div>{" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <button
                    onClick={() => handleModeration("rejected")}
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:text-slate-900 dark:text-white text-rose-450 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {" "}
                    <X className="w-4 h-4 mr-1.5" /> Reject Submission{" "}
                  </button>{" "}
                  <button
                    onClick={() => handleModeration("approved")}
                    disabled={processing}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {" "}
                    {processing ? (
                      <RefreshCw className="animate-spin w-4 h-4 mr-1.5" />
                    ) : (
                      <Check className="w-4 h-4 mr-1.5" />
                    )}{" "}
                    Approve and Index{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/5">
              {" "}
              <FileClock className="w-12 h-12 text-slate-400 dark:text-slate-650 mb-3 animate-pulse-slow" />{" "}
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                Select Submission
              </p>{" "}
              <p className="text-xs text-slate-600 dark:text-slate-500 max-w-sm mt-1">
                {" "}
                Choose a submission card from the list on the left to review,
                adjust, and approve.{" "}
              </p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </AdminLayout>
  );
};
export default AdminPendingSubmissions;
