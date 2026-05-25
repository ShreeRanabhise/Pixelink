import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Lightbulb, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import SEO from '../../components/common/SEO';
import api from '../../api/axios';

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' or 'queries'
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      const res = await api.get('/contact-messages');
      return res.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/contact-messages/${id}`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success('Message status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contact-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
      toast.success('Message deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    },
  });

  const suggestions = messages.filter((m) => m.type === 'Suggestion');
  const queries = messages.filter((m) => m.type === 'Query');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>;
      case 'Resolved':
      case 'Accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{status}</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">Rejected</span>;
      default:
        return null;
    }
  };

  const renderMessageCard = (msg) => (
    <div key={msg._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{msg.subject || 'No Subject'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">From: <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.name}</span> ({msg.email})</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(msg.status)}
            <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {msg.message}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
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

        <div className="flex space-x-3">
          {msg.type === 'Suggestion' && msg.status === 'Pending' && (
            <>
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Rejected' })}
                disabled={updateStatusMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </button>
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Accepted' })}
                disabled={updateStatusMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Accept
              </button>
            </>
          )}

          {msg.type === 'Query' && msg.status === 'Pending' && (
            <button
              onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Resolved' })}
              disabled={updateStatusMutation.isLoading}
              className="inline-flex items-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Mark Resolved
            </button>
          )}

          {msg.status !== 'Pending' && (
            <button
              onClick={() => updateStatusMutation.mutate({ id: msg._id, status: 'Pending' })}
              disabled={updateStatusMutation.isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Clock className="w-4 h-4 mr-1.5" />
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Messages Dashboard">
      <SEO title="Manage Messages" />
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review user queries and suggestions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center justify-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggestions ({suggestions.filter(s => s.status === 'Pending').length} pending)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'queries'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Queries ({queries.filter(q => q.status === 'Pending').length} pending)
            </span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'suggestions' && (
            suggestions.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {suggestions.map(renderMessageCard)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                <Lightbulb className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No suggestions</h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Users haven't sent any suggestions yet.</p>
              </div>
            )
          )}

          {activeTab === 'queries' && (
            queries.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {queries.map(renderMessageCard)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No queries</h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Users haven't sent any queries yet.</p>
              </div>
            )
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
