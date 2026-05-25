import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MessageSquare, Lightbulb, CheckCircle, XCircle, Clock, 
  Trash2, Search, Filter, Mail, ListChecks, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import SEO from '../../components/common/SEO';
import api from '../../api/axios';

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState('suggestions'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);

  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      const res = await api.get('/contact-messages');
      return res.data.data;
    },
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/contact-messages/${id}`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success('Message status updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update status'),
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contact-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success('Message deleted');
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id)); // Clean up if selected
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete message'),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ messageIds, status }) => {
      const res = await api.put(`/contact-messages/bulk-status`, { messageIds, status });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success(data.message || 'Messages updated');
      setSelectedIds([]);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update messages'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (messageIds) => {
      const res = await api.post(`/contact-messages/bulk-delete`, { messageIds });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success(data.message || 'Messages deleted');
      setSelectedIds([]);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete messages'),
  });

  // Derived Data & Filtering
  const filteredMessages = useMemo(() => {
    let filtered = messages.filter(m => m.type.toLowerCase() === activeTab.replace(/s$/, '')); // primitive singularize
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        (m.name || '').toLowerCase().includes(lowerTerm) ||
        (m.email || '').toLowerCase().includes(lowerTerm) ||
        (m.subject || '').toLowerCase().includes(lowerTerm) ||
        (m.message || '').toLowerCase().includes(lowerTerm)
      );
    }
    
    return filtered;
  }, [messages, activeTab, statusFilter, searchTerm]);

  // Analytics
  const pendingSuggestions = messages.filter(m => m.type === 'Suggestion' && m.status === 'Pending').length;
  const pendingQueries = messages.filter(m => m.type === 'Query' && m.status === 'Pending').length;
  const processedMessages = messages.filter(m => m.status !== 'Pending').length;

  // Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredMessages.map(m => m._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleReply = (email, subject) => {
    const safeSubject = encodeURIComponent(`Re: ${subject || 'Your message to Pixelink'}`);
    window.location.href = `mailto:${email}?subject=${safeSubject}`;
  };

  // UI Helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">Pending</span>;
      case 'Resolved':
      case 'Accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">{status}</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400">Rejected</span>;
      default:
        return null;
    }
  };

  const renderMessageCard = (msg) => {
    const isSelected = selectedIds.includes(msg._id);
    const isLongMessage = msg.message.length > 150;
    
    return (
      <div key={msg._id} className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-colors shadow-sm flex flex-col justify-between ${isSelected ? 'border-brand-500 ring-1 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => handleSelectOne(msg._id)}
                className="mt-1.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{msg.subject || 'No Subject'}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{msg.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">({msg.email})</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 flex-shrink-0">
              {getStatusBadge(msg.status)}
              <span className="text-xs text-slate-400 font-medium">{new Date(msg.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300">
            <p className="whitespace-pre-wrap">
              {isLongMessage ? msg.message.substring(0, 150) + '...' : msg.message}
            </p>
            {isLongMessage && (
              <button 
                onClick={() => setExpandedMessage(msg)}
                className="text-brand-500 hover:text-brand-600 font-semibold mt-2 text-xs uppercase tracking-wider"
              >
                Read Full Message
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this message?')) {
                  deleteMessageMutation.mutate(msg._id);
                }
              }}
              className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
              title="Delete Message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleReply(msg.email, msg.subject)}
              className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
              title="Reply via Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-2">
            {msg.type === 'Suggestion' && msg.status === 'Pending' && (
              <>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Rejected' })}
                  disabled={updateStatusMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Accepted' })}
                  disabled={updateStatusMutation.isLoading}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                </button>
              </>
            )}

            {msg.type === 'Query' && msg.status === 'Pending' && (
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Resolved' })}
                disabled={updateStatusMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve
              </button>
            )}

            {msg.status !== 'Pending' && (
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Pending' })}
                disabled={updateStatusMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Clock className="w-3.5 h-3.5 mr-1" /> Reopen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title="Messages CRM">
      <SEO title="Manage Messages" />
      
      {/* Quick Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Suggestions</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingSuggestions}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Queries</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingQueries}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Processed Messages</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{processedMessages}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl border-x border-t border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { setActiveTab('suggestions'); setSelectedIds([]); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center justify-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggestions
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('queries'); setSelectedIds([]); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
              activeTab === 'queries'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Queries
            </span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filter & Bulk Actions */}
      <div className="bg-white dark:bg-slate-900 p-4 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-2xl mb-6 shadow-sm space-y-4 md:space-y-0 md:flex items-center justify-between">
        
        <div className="flex items-center gap-4 flex-1">
          <label className="flex items-center cursor-pointer group">
            <input 
              type="checkbox" 
              checked={filteredMessages.length > 0 && selectedIds.length === filteredMessages.length}
              onChange={handleSelectAll}
              disabled={filteredMessages.length === 0}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 dark:border-slate-700 dark:bg-slate-800 cursor-pointer disabled:opacity-50"
            />
            <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Select All</span>
          </label>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 animate-in fade-in slide-in-from-left-4">
              <span className="text-xs font-bold text-brand-500 mr-2">{selectedIds.length} Selected:</span>
              
              <button 
                onClick={() => {
                  if (window.confirm(`Delete ${selectedIds.length} messages?`)) {
                    bulkDeleteMutation.mutate(selectedIds);
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Bulk Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {activeTab === 'queries' && (
                 <button 
                 onClick={() => bulkUpdateMutation.mutate({ messageIds: selectedIds, status: 'Resolved' })}
                 className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                 title="Bulk Resolve"
               >
                 <CheckCircle className="w-4 h-4" />
               </button>
              )}

              {activeTab === 'suggestions' && (
                <>
                  <button 
                    onClick={() => bulkUpdateMutation.mutate({ messageIds: selectedIds, status: 'Accepted' })}
                    className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                    title="Bulk Accept"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => bulkUpdateMutation.mutate({ messageIds: selectedIds, status: 'Rejected' })}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Bulk Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300 transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="space-y-6 min-h-[400px]">
          {filteredMessages.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredMessages.map(renderMessageCard)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListChecks className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No messages found</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'All' 
                  ? "We couldn't find any messages matching your current search and filter criteria." 
                  : `There are currently no ${activeTab} in the database.`}
              </p>
              {(searchTerm || statusFilter !== 'All') && (
                <button 
                  onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                  className="mt-4 text-sm font-bold text-brand-500 hover:text-brand-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Read More Modal */}
      {expandedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setExpandedMessage(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl glass flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{expandedMessage.subject || 'No Subject'}</h3>
                <p className="text-sm text-slate-500 mt-1">From: <span className="font-semibold text-slate-700 dark:text-slate-300">{expandedMessage.name}</span> &lt;{expandedMessage.email}&gt;</p>
              </div>
              <button onClick={() => setExpandedMessage(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl flex-1 custom-scrollbar">
              <p className="text-base text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {expandedMessage.message}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
              <button 
                onClick={() => handleReply(expandedMessage.email, expandedMessage.subject)}
                className="inline-flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply to User
              </button>
              {getStatusBadge(expandedMessage.status)}
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminMessages;
