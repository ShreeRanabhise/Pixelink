import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Wand2, AlertCircle, RefreshCw, UploadCloud, Image, Tag, AlignLeft } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/layout/AdminLayout';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

const AdminAIGenerator = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewBase64, setPreviewBase64] = useState('');
  const [generatedTags, setGeneratedTags] = useState([]);
  const [generatedDescription, setGeneratedDescription] = useState('');

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
      toast.error('Please enter a title and select a category to generate the PNG.');
      return;
    }
    
    setIsGenerating(true);
    setPreviewBase64('');
    setGeneratedTags([]);
    setGeneratedDescription('');
    
    try {
      const res = await api.post('/ai/generate-png', { title: title.trim(), categoryId });
      setPreviewBase64(res.data.data.image);
      setGeneratedTags(res.data.data.tags);
      setGeneratedDescription(res.data.data.description);
      toast.success('AI PNG and metadata generated successfully! Please review.');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate AI PNG');
    } finally {
      setIsGenerating(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  const handlePublish = async () => {
    if (!title.trim() || !categoryId) {
      toast.error('Please enter a title and select a category before publishing.');
      return;
    }
    if (!previewBase64) {
      toast.error('Please generate a PNG first.');
      return;
    }

    setIsPublishing(true);
    try {
      const file = dataURLtoFile(previewBase64, `${title.replace(/\s+/g, '-').toLowerCase()}.png`);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title.trim());
      formData.append('categoryId', categoryId);
      formData.append('description', generatedDescription);
      formData.append('tags', generatedTags.join(','));
      formData.append('runAI', 'false'); // Use generated metadata

      await api.post('/pngs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('AI Generated PNG published successfully!');
      navigate('/admin/pngs');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to publish PNG');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AdminLayout title="AI PNG Generator">
      <SEO title="AI PNG Generator - Admin Panel" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
            <div className="flex items-center space-x-3 text-brand-500 mb-2">
              <Wand2 className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Generation Settings</h2>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Asset Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. White Tiger Roaring"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categoriesRes?.data?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-brand-600 dark:text-brand-400">
                  AI will automatically generate the transparent image, an SEO-friendly description, and 25 optimal tags based on the title and category.
                </p>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl shadow-lg transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <><RefreshCw className="animate-spin h-4 w-4 mr-2" /> Generating via DALL-E 3 & GPT-4o...</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" /> Generate PNG & Metadata</>
                )}
              </button>
            </form>
          </div>

          {previewBase64 && (
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Publish</h2>
              
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isPublishing ? (
                  <><RefreshCw className="animate-spin h-4 w-4 mr-2" /> Publishing to Catalog...</>
                ) : (
                  <><UploadCloud className="w-4 h-4 mr-2" /> Submit to Catalog</>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/10 overflow-hidden sticky top-24 min-h-[350px] flex flex-col justify-center items-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center h-[350px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Wand2 className="w-12 h-12 text-brand-500 animate-bounce relative z-10" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">AI is crafting your asset...</p>
                <p className="text-xs text-slate-500">This might take 10-20 seconds.</p>
              </div>
            ) : previewBase64 ? (
              <div className="w-full h-full flex flex-col">
                <div className="w-full p-4 bg-checkerboard bg-[size:10px_10px] flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                  <img src={previewBase64} alt="AI Generated Preview" className="max-w-full max-h-[40vh] object-contain drop-shadow-2xl rounded-lg" />
                </div>
                <div className="p-5 space-y-4 bg-slate-50 dark:bg-slate-900/50 flex-1">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                      <AlignLeft className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Description</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{generatedDescription}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                      <Tag className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Generated Tags ({generatedTags.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedTags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 h-[350px] flex flex-col items-center justify-center">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAIGenerator;
