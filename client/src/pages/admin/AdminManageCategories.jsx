import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  ArrowLeft,
  Save,
  X,
  RefreshCw,
  Upload,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO";
const AdminManageCategories = () => {
  const queryClient = useQueryClient();
  const navigate =
    useNavigate(); /* Active category being edited (null for new category mode)  */
  const [editingCategory, setEditingCategory] =
    useState(null); /* Form states  */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false); /* Fetch Categories  */
  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });
  const categories = categoriesRes?.data || [];
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        toast.error("Only JPG or JPEG images are allowed for category covers.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
  };
  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageFile(null);
    setImagePreview(cat.image || "");
  }; /* Submit Handler (Create or Update)  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (!editingCategory && !imageFile) {
      toast.error("Please upload a cover image for the new category.");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      if (editingCategory) {
        /* Update  */
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated successfully!");
      } else {
        /* Create  */
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created successfully!");
      }
      queryClient.invalidateQueries(["categories"]);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  }; /* Delete Mutation  */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categories"]);
      if (editingCategory && editingCategory._id === deleteMutation.variables) {
        resetForm();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
  const handleDelete = (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete category"${name}"? This could leave PNGs inside it uncategorized.`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <AdminLayout title="Category Builder">
      {" "}
      <SEO title="Manage Categories" /> {/* Navigation and Back */}{" "}
      <div className="flex items-center space-x-3 mb-6">
        {" "}
        <button
          onClick={() => navigate("/admin")}
          className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:text-white rounded-xl transition-colors"
        >
          {" "}
          <ArrowLeft className="w-4 h-4" />{" "}
        </button>{" "}
        <span className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-455 font-bold uppercase tracking-wider">
          Back to Control Center
        </span>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Editor Form (Left Panel) */}{" "}
        <div className="lg:col-span-1">
          {" "}
          <form
            onSubmit={handleSubmit}
            className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6 sticky top-6"
          >
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {" "}
                {editingCategory
                  ? "Update Category"
                  : "Create New Category"}{" "}
              </h2>{" "}
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                {" "}
                {editingCategory
                  ? "Modify existing taxonomy properties"
                  : "Register a new catalog categorization index"}{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-4">
              {" "}
              {/* Name */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category Name *
                </label>{" "}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:outline-none transition-all"
                  required
                />{" "}
              </div>{" "}
              {/* Description */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </label>{" "}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what kinds of Png's graphics belong here..."
                  rows="3"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-650 focus:border-brand-500 focus:outline-none resize-none transition-all"
                />{" "}
              </div>{" "}
              {/* Cover Image Upload */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Cover Image *
                </label>{" "}
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center group">
                    {" "}
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-all duration-300"
                    />{" "}
                    <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                      {" "}
                      <label className="cursor-pointer bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-400 dark:border-slate-700">
                        {" "}
                        Replace Cover{" "}
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/jpeg"
                          className="hidden"
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-100 dark:bg-slate-950/40 rounded-2xl py-8 transition-all">
                    {" "}
                    <Upload className="w-6 h-6 text-slate-600 dark:text-slate-500 mb-2" />{" "}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Click to upload cover
                    </span>{" "}
                    <span className="text-[10px] text-slate-600 dark:text-slate-500 mt-1">
                      JPG or JPEG format only
                    </span>{" "}
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/jpeg"
                      className="hidden"
                    />{" "}
                  </label>
                )}{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-850">
              {" "}
              {editingCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-2xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-750 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {" "}
                  Cancel{" "}
                </button>
              )}{" "}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg transition-all"
              >
                {" "}
                {submitting ? (
                  <RefreshCw className="animate-spin w-4 h-4 mr-1.5" />
                ) : editingCategory ? (
                  <Save className="w-4 h-4 mr-1.5" />
                ) : (
                  <Plus className="w-4 h-4 mr-1.5" />
                )}{" "}
                {editingCategory ? "Save Changes" : "Create Category"}{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
        {/* Existing Categories List (Right Panel) */}{" "}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            {" "}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Taxonomy Nodes
            </h2>{" "}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                {" "}
                <RefreshCw className="animate-spin w-8 h-8 text-brand-500" />{" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-455">
                  Loading categories...
                </p>{" "}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                {" "}
                <Folder className="w-10 h-10 text-slate-400 dark:text-slate-650 mx-auto mb-3" />{" "}
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
                  No categories created yet
                </p>{" "}
                <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
                  Use the editor panel to establish the first folder node.
                </p>{" "}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`glass rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${editingCategory?._id === cat._id ? "border-brand-500 bg-brand-500/5 shadow-brand-500/5 shadow-lg" : "border-slate-200 dark:border-slate-850 hover:border-slate-400 dark:border-slate-700 bg-slate-100 dark:bg-slate-950/20"}`}
                  >
                    {" "}
                    {/* Header Image */}{" "}
                    <div className="h-28 relative">
                      {" "}
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover filter brightness-50"
                      />{" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                        {" "}
                        <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                          {cat.name}
                        </span>{" "}
                        <span className="text-[10px] text-brand-400 font-mono font-semibold mt-0.5">
                          /{cat.slug}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    {/* Description & Buttons */}{" "}
                    <div className="p-4 space-y-4">
                      {" "}
                      <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem]">
                        {" "}
                        {cat.description || "No description provided."}{" "}
                      </p>{" "}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-900/60">
                        {" "}
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-350 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          {" "}
                          <Edit2 className="w-3.5 h-3.5" />{" "}
                          <span>Edit</span>{" "}
                        </button>{" "}
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 rounded-xl text-[11px] font-bold text-rose-450 hover:text-white transition-all flex items-center space-x-1"
                        >
                          {" "}
                          <Trash2 className="w-3.5 h-3.5" />{" "}
                          <span>Delete</span>{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </AdminLayout>
  );
};
export default AdminManageCategories;
