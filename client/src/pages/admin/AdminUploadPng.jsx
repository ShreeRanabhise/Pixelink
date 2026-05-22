import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UploadCloud,
  Image,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const AdminUploadPng = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [runAI, setRunAI] = useState(false);
  const [submitting, setSubmitting] =
    useState(false); /* Fetch categories for select dropdown  */
  const { data: categoriesRes, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.includes("png")) {
        toast.error("Please select a PNG format image.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      /* Auto fill title if empty */
      if (!title) {
        const nameWithoutExt =
          selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) ||
          selectedFile.name;
        setTitle(nameWithoutExt.replace(/[-_]/g, " "));
      }
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.type.includes("png")) {
        toast.error("Only PNG images are supported.");
        return;
      }
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      if (!title) {
        const nameWithoutExt =
          droppedFile.name.substring(0, droppedFile.name.lastIndexOf(".")) ||
          droppedFile.name;
        setTitle(nameWithoutExt.replace(/[-_]/g, " "));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload an image file first.");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("categoryId", categoryId);
    formData.append("tags", tags);
    formData.append("featured", featured ? "true" : "false");
    formData.append("runAI", runAI ? "true" : "false");
    try {
      await api.post("/pngs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("PNG published successfully to active catalog!");
      queryClient.invalidateQueries(["adminPngsCount"]);
      queryClient.invalidateQueries(["featuredPngs"]);
      queryClient.invalidateQueries(["popularPngs"]);
      navigate("/admin/pngs");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload PNG");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AdminLayout title="Direct Catalog Upload">
      {" "}
      <SEO title="Direct Upload Panel" />{" "}
      <div className="flex items-center space-x-3 mb-6">
        {" "}
        <button
          onClick={() => navigate("/admin")}
          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:text-white rounded-xl transition-colors"
        >
          {" "}
          <ArrowLeft className="w-4 h-4" />{" "}
        </button>{" "}
        <span className="text-xs text-slate-600 dark:text-slate-450 font-bold uppercase tracking-wider">
          Back to Dashboard
        </span>{" "}
      </div>{" "}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {" "}
        {/* Visual Dropzone area (Left/Center) */}{" "}
        <div className="lg:col-span-1 space-y-6">
          {" "}
          <div className="glass rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 overflow-hidden flex flex-col justify-between min-h-[350px] relative">
            {" "}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-t-3xl transition-all ${preview ? "border-slate-800/80 bg-checkerboard bg-[size:10px_10px]" : "border-slate-300 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/30"}`}
            >
              {" "}
              {preview ? (
                <div className="relative group max-w-full flex items-center justify-center p-4">
                  {" "}
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="max-h-60 max-w-full object-contain filter drop-shadow-2xl"
                  />{" "}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 rounded-2xl">
                    {" "}
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold border border-slate-400 dark:border-slate-700">
                      {" "}
                      Change File{" "}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png"
                        className="hidden"
                      />{" "}
                    </label>{" "}
                  </div>{" "}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-3.5 w-full h-full py-16">
                  {" "}
                  <div className="p-4 bg-brand-500/10 text-brand-500 rounded-2xl border border-brand-500/20">
                    {" "}
                    <UploadCloud className="w-7 h-7" />{" "}
                  </div>{" "}
                  <div className="text-center">
                    {" "}
                    <span className="text-sm font-bold text-white block">
                      Click to select PNG
                    </span>{" "}
                    <span className="text-[11px] text-slate-600 dark:text-slate-500 block mt-1">
                      Or drag and drop files directly
                    </span>{" "}
                  </div>{" "}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png"
                    className="hidden"
                  />{" "}
                </label>
              )}{" "}
            </div>{" "}
            <div className="p-4 bg-white/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-850 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
              {" "}
              <AlertCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />{" "}
              <span>
                Transparent alpha check is recommended before submitting.
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Form fields & toggles (Right Panels) */}{" "}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            {" "}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              PNG Asset Properties
            </h2>{" "}
            <div className="space-y-4">
              {" "}
              <div className="space-y-2">
                {" "}
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  PNG Title *
                </label>{" "}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vintage Leather Chair Cutout"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </label>{" "}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the asset, usage context, or origin..."
                  rows="3"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all resize-none"
                />{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category *
                  </label>{" "}
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                    required
                  >
                    {" "}
                    <option value="" className="bg-slate-50 dark:bg-slate-950">
                      Select Category
                    </option>{" "}
                    {categoriesRes?.data?.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        className="bg-slate-50 dark:bg-slate-950"
                      >
                        {" "}
                        {cat.name}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tags (comma separated)
                  </label>{" "}
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="chair, luxury, furniture, leather"
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                    disabled={runAI}
                  />{" "}
                  {runAI && (
                    <p className="text-[10px] text-brand-400">
                      AI auto-tagging will generate optimized keyword indices.
                    </p>
                  )}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Checkbox / Switch controls */}{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-850">
              {" "}
              <div className="flex items-center space-x-3 bg-slate-900/30 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl">
                {" "}
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-brand-650 focus:ring-brand-500 border-slate-300 dark:border-slate-800 w-4 h-4 bg-slate-50 dark:bg-slate-950"
                />{" "}
                <label htmlFor="featured" className="cursor-pointer">
                  {" "}
                  <span className="text-sm font-bold text-white block">
                    Pin to Featured
                  </span>{" "}
                  <span className="text-[10px] text-slate-600 dark:text-slate-500">
                    Showcase this PNG on the home page gallery.
                  </span>{" "}
                </label>{" "}
              </div>{" "}
              <div className="flex items-center space-x-3 bg-slate-900/30 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl">
                {" "}
                <input
                  type="checkbox"
                  id="runAI"
                  checked={runAI}
                  onChange={(e) => setRunAI(e.target.checked)}
                  className="rounded text-brand-650 focus:ring-brand-500 border-slate-300 dark:border-slate-800 w-4 h-4 bg-slate-50 dark:bg-slate-950"
                />{" "}
                <label
                  htmlFor="runAI"
                  className="cursor-pointer flex items-center space-x-2"
                >
                  {" "}
                  <div>
                    {" "}
                    <span className="text-sm font-bold text-white flex items-center">
                      {" "}
                      Run AI Pipelines{" "}
                      <Sparkles className="w-3.5 h-3.5 ml-1.5 text-brand-450 animate-pulse" />{" "}
                    </span>{" "}
                    <span className="text-[10px] text-slate-600 dark:text-slate-500">
                      Execute BG removal fallback & auto-labeling.
                    </span>{" "}
                  </div>{" "}
                </label>{" "}
              </div>{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={submitting || catsLoading}
              className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {" "}
              {submitting ? (
                <>
                  {" "}
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Processing
                  Upload & Indexing...{" "}
                </>
              ) : (
                "Upload and Publish PNG"
              )}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </form>{" "}
    </AdminLayout>
  );
};
export default AdminUploadPng;
