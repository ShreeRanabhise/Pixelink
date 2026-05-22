import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  Star,
  StarOff,
  Save,
  X,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const AdminManagePngs = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPng, setEditingPng] = useState(null); /* Edit Form States  */
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editFeatured, setEditFeatured] =
    useState(false); /* Fetch Categories for Edit Dropdown  */
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  }); /* Fetch Active PNGs  */
  const {
    data: pngsRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminPngs", searchQuery],
    queryFn: async () => {
      const url = searchQuery.trim()
        ? `/pngs?search=${encodeURIComponent(searchQuery.trim())}&limit=50`
        : `/pngs?limit=50`;
      const res = await api.get(url);
      return res.data;
    },
  }); /* Deletion Mutation  */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/pngs/${id}`);
    },
    onSuccess: () => {
      toast.success("PNG deleted successfully!");
      queryClient.invalidateQueries(["adminPngs"]);
      queryClient.invalidateQueries(["adminPngsCount"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete PNG");
    },
  }); /* Update Mutation  */
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await api.put(`/pngs/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("PNG updated successfully!");
      setEditingPng(null);
      queryClient.invalidateQueries(["adminPngs"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update PNG");
    },
  });
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this PNG? This will also remove it from Cloudinary.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };
  const handleStartEdit = (png) => {
    setEditingPng(png);
    setEditTitle(png.title);
    setEditDesc(png.description || "");
    setEditCategoryId(png.category?._id || png.category || "");
    setEditTags(png.tags?.join(", ") || "");
    setEditFeatured(png.featured || false);
  };
  const handleCancelEdit = () => {
    setEditingPng(null);
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    updateMutation.mutate({
      id: editingPng._id,
      updatedData: {
        title: editTitle.trim(),
        description: editDesc.trim(),
        categoryId: editCategoryId,
        tags: editTags,
        featured: editFeatured,
      },
    });
  };
  const toggleFeaturedDirect = (png) => {
    updateMutation.mutate({
      id: png._id,
      updatedData: { featured: !png.featured },
    });
  };
  return (
    <AdminLayout title="Gallery Audit Center">
      {" "}
      <SEO title="Manage PNGs" /> {/* Header and Controls */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {" "}
        <div className="flex items-center space-x-3">
          {" "}
          <button
            onClick={() => navigate("/admin")}
            className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:text-white rounded-xl transition-colors"
          >
            {" "}
            <ArrowLeft className="w-4 h-4" />{" "}
          </button>{" "}
          <span className="text-xs text-slate-600 dark:text-slate-450 font-bold uppercase tracking-wider">
            Back to Control Center
          </span>{" "}
        </div>{" "}
        {/* Search Filter */}{" "}
        <div className="relative max-w-sm w-full">
          {" "}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
            {" "}
            <Search className="w-4 h-4" />{" "}
          </div>{" "}
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
          />{" "}
        </div>{" "}
      </div>{" "}
      {/* Edit Overlay / Modal */}{" "}
      {editingPng && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {" "}
          <div
            className="absolute inset-0 bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm"
            onClick={handleCancelEdit}
          ></div>{" "}
          <form
            onSubmit={handleSaveEdit}
            className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 w-full max-w-xl relative z-10 space-y-5 text-left"
          >
            {" "}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
              {" "}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit PNG Details
              </h3>{" "}
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white rounded-lg hover:bg-slate-200 dark:bg-slate-800"
              >
                {" "}
                <X className="w-5 h-5" />{" "}
              </button>{" "}
            </div>{" "}
            <div className="space-y-4">
              {" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Title
                </label>{" "}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none"
                  required
                />{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Description
                </label>{" "}
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows="2"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none resize-none"
                />{" "}
              </div>{" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {" "}
                <div className="space-y-1.5">
                  {" "}
                  <label className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase">
                    Category
                  </label>{" "}
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none"
                    required
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
                  <label className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold uppercase">
                    Tags
                  </label>{" "}
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl">
                {" "}
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="rounded text-brand-650 focus:ring-brand-500 border-slate-300 dark:border-slate-800 w-4 h-4 bg-white dark:bg-slate-900"
                />{" "}
                <label htmlFor="editFeatured" className="cursor-pointer">
                  {" "}
                  <span className="text-sm font-bold text-white block">
                    Featured Asset
                  </span>{" "}
                  <span className="text-[10px] text-slate-600 dark:text-slate-500">
                    Showcase this cutout on homepage panels
                  </span>{" "}
                </label>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-850">
              {" "}
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                {" "}
                Cancel{" "}
              </button>{" "}
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-lg"
              >
                {" "}
                {updateMutation.isPending ? (
                  <RefreshCw className="animate-spin w-4 h-4 mr-1.5" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}{" "}
                Save Changes{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>
      )}{" "}
      {/* Main List Layout */}{" "}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          {" "}
          <RefreshCw className="animate-spin w-8 h-8 text-brand-500" />{" "}
          <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">
            Loading active catalog...
          </p>{" "}
        </div>
      ) : !pngsRes?.data || pngsRes.data.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
          {" "}
          <Image className="w-12 h-12 text-slate-400 dark:text-slate-650 mx-auto mb-3" />{" "}
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No active assets found
          </p>{" "}
          <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
            Try broadening your filter keywords or upload a new file.
          </p>{" "}
        </div>
      ) : (
        <div className="glass rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 overflow-hidden">
          {" "}
          <div className="overflow-x-auto">
            {" "}
            <table className="w-full border-collapse text-left text-xs">
              {" "}
              <thead>
                {" "}
                <tr className="border-b border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/40 text-slate-600 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {" "}
                  <th className="px-6 py-4">PNG Asset</th>{" "}
                  <th className="px-6 py-4">Category</th>{" "}
                  <th className="px-6 py-4">Stats</th>{" "}
                  <th className="px-6 py-4">Status</th>{" "}
                  <th className="px-6 py-4 text-right">Actions</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-slate-850/60">
                {" "}
                {pngsRes.data.map((png) => (
                  <tr
                    key={png._id}
                    className="hover:bg-white/80 dark:bg-slate-900/20 transition-colors"
                  >
                    {" "}
                    {/* Thumbnail & Title */}{" "}
                    <td className="px-6 py-4 flex items-center space-x-3.5">
                      {" "}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden bg-checkerboard bg-[size:6px_6px] flex items-center justify-center flex-shrink-0">
                        {" "}
                        <img
                          src={png.imageUrl}
                          alt={png.title}
                          className="w-10 h-10 object-contain filter drop-shadow"
                        />{" "}
                      </div>{" "}
                      <div className="min-w-0">
                        {" "}
                        <span className="font-bold text-white block truncate max-w-[200px]">
                          {png.title}
                        </span>{" "}
                        <span className="text-[10px] text-slate-550 block truncate max-w-[200px]">
                          {" "}
                          {png.tags?.join(", ") || "no tags"}{" "}
                        </span>{" "}
                      </div>{" "}
                    </td>{" "}
                    {/* Category */}{" "}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {" "}
                      <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-800 font-semibold">
                        {" "}
                        {png.category?.name || "Uncategorized"}{" "}
                      </span>{" "}
                    </td>{" "}
                    {/* Stats */}{" "}
                    <td className="px-6 py-4">
                      {" "}
                      <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-500 dark:text-slate-400 font-medium">
                        {" "}
                        <span className="flex items-center">
                          {" "}
                          <Eye className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-500" />{" "}
                          {png.views}{" "}
                        </span>{" "}
                        <span className="flex items-center">
                          {" "}
                          <Download className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-500" />{" "}
                          {png.downloads}{" "}
                        </span>{" "}
                      </div>{" "}
                    </td>{" "}
                    {/* Status badges */}{" "}
                    <td className="px-6 py-4">
                      {" "}
                      <button
                        onClick={() => toggleFeaturedDirect(png)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all ${png.featured ? "bg-amber-500/10 border-amber-500/35 text-amber-400 font-bold" : "bg-white/80 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:border-amber-500/30 hover:text-amber-400"}`}
                        title="Toggle Homepage Showcase"
                      >
                        {" "}
                        {png.featured ? (
                          <Star className="w-3 h-3 fill-current" />
                        ) : (
                          <StarOff className="w-3 h-3" />
                        )}{" "}
                        <span className="text-[10px] uppercase font-semibold">
                          Featured
                        </span>{" "}
                      </button>{" "}
                    </td>{" "}
                    {/* Actions */}{" "}
                    <td className="px-6 py-4 text-right">
                      {" "}
                      <div className="flex items-center justify-end space-x-2">
                        {" "}
                        <button
                          onClick={() => handleStartEdit(png)}
                          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                          title="Edit Details"
                        >
                          {" "}
                          <Edit2 className="w-3.5 h-3.5" />{" "}
                        </button>{" "}
                        <button
                          onClick={() => handleDelete(png._id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white border border-rose-500/20 rounded-xl transition-all"
                          title="Delete Permanently"
                        >
                          {" "}
                          <Trash2 className="w-3.5 h-3.5" />{" "}
                        </button>{" "}
                      </div>{" "}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </AdminLayout>
  );
};
export default AdminManagePngs;
