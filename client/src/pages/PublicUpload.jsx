import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UploadCloud, CheckCircle2, FileImage, Image as ImageIcon, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import SEO from '../components/common/SEO';

const PublicUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch categories for dropdown selector
  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'image/png') {
      toast.error('Only transparent PNG files are allowed!');
      return;
    }

    setFile(selectedFile);
    
    // Generate image preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.type !== 'image/png') {
      toast.error('Only transparent PNG files are allowed!');
      return;
    }

    setFile(droppedFile);
    const objectUrl = URL.createObjectURL(droppedFile);
    setPreviewUrl(objectUrl);
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a PNG file to upload');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a descriptive title');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('categoryId', categoryId);
      formData.append('tags', tags.trim());

      const response = await api.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadSuccess(true);
        // Fire confetti fireworks!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#a78bfa', '#f43f5e', '#10b981'],
        });
        toast.success(response.data.message || 'Submitted successfully!');
        
        // Reset form
        setTitle('');
        setDescription('');
        setCategoryId('');
        setTags('');
        removeFile();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SEO title="Submit Your PNG" description="Upload your custom transparent Png's PNG files to help the developer community. Submissions are reviewed by admins." />

      <div className="space-y-6 text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Submit Your Transparent PNG
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Share your high-quality transparent PNG graphics. Submissions go to a review queue and will be published once approved.
        </p>
      </div>

      {uploadSuccess ? (
        <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/30 rounded-[2rem] p-10 sm:p-16 text-center space-y-6 shadow-2xl max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Upload Received!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Thank you for contributing. Your image was stored in our submission folder, and our moderators will review and approve it shortly.
          </p>
          <button
            onClick={() => setUploadSuccess(false)}
            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-md shadow-brand-500/20 active:scale-95"
          >
            Upload Another PNG
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"></div>
          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Upload Image File (PNG Only)
            </label>
            
            {previewUrl ? (
              <div className="relative border-2 border-dashed border-brand-500/50 dark:border-brand-500/40 rounded-3xl p-4 flex flex-col items-center justify-center checkerboard-bg h-72 overflow-hidden shadow-inner">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain drop-shadow-md select-none"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold px-3 py-1.5 transition-colors shadow-lg active:scale-90"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-brand-500/30 dark:border-brand-500/30 rounded-3xl p-8 text-center hover:border-brand-500 hover:bg-brand-500/5 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 cursor-pointer transition-all glass bg-white/40 dark:bg-slate-900/30 backdrop-blur-md h-72 flex flex-col items-center justify-center group shadow-sm"
              >
                <input
                  type="file"
                  id="file-input"
                  accept="image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer space-y-4 flex flex-col items-center justify-center">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-400 group-hover:text-brand-500">
                    <UploadCloud className="w-8 h-8 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Drag & drop your PNG here or <span className="text-brand-500 hover:underline">browse files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      File format must be transparent PNG, up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Title input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Descriptive Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Red Rose Branch Png's"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-2xl glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>

          {/* Description input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="e.g. Describe the Png's, context, or usage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-5 py-4 rounded-2xl glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all text-sm font-medium shadow-sm resize-none"
            />
          </div>

          {/* Grid Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category dropdown */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all text-sm font-medium shadow-sm"
              >
                <option value="">Choose category...</option>
                {categoriesRes?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                id="tags"
                placeholder="e.g. flower, rose, nature, plant, Png's"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all text-sm font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex space-x-2.5 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/30">
            <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              By uploading, you warrant that you own the rights to the image, it has a completely transparent alpha mask (no solid background), and contains no explicit content.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex items-center justify-center px-8 py-5 text-lg font-black text-white bg-gradient-brand hover:opacity-90 rounded-2xl shadow-xl shadow-brand-500/25 transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? 'Uploading Submission...' : 'Submit PNG'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PublicUpload;
