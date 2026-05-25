import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, UserPlus, Trash2, Edit2, ShieldAlert,
  Search, CheckCircle, ShieldCheck, UserCog, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import SEO from '../../components/common/SEO';
import api from '../../api/axios';

const AdminManageTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'creator' });
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data.data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/users', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('Team member added successfully');
      closeModal();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to add team member'),
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/users/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('Team member updated successfully');
      closeModal();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update team member'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('Team member removed');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to remove team member'),
  });

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'creator' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name || '', email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // don't send empty password
      updateUserMutation.mutate({ id: editingUser._id, data: payload });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const renderRoleBadge = (role) => {
    switch(role) {
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400"><ShieldCheck className="w-3 h-3 mr-1" /> Admin</span>;
      case 'inspector':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"><ShieldAlert className="w-3 h-3 mr-1" /> Inspector</span>;
      case 'creator':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-400"><UserCog className="w-3 h-3 mr-1" /> Creator</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Manage Team">
      <SEO title="Manage Team Members" />

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search team members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300 transition-all"
          />
        </div>
        
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress / Activity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                   <tr>
                     <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                       No team members found matching your search.
                     </td>
                   </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase border border-slate-200 dark:border-slate-700">
                            {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {user.name || 'No Name Provided'}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {user.role === 'admin' ? (
                            <span className="text-xs font-semibold text-slate-500">System Administrator</span>
                          ) : user.role === 'creator' ? (
                            <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              {user.uploadsCount} PNGs Uploaded
                            </div>
                          ) : (
                            <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              {user.reviewsCount} Submissions Reviewed
                            </div>
                          )}
                          <span className="text-xs text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-brand-500 hover:text-brand-600 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors mr-2"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this team member? This cannot be undone.')) {
                              deleteUserMutation.mutate(user._id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="Remove User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl glass animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
              {editingUser ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  placeholder="jane@pixelink.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {editingUser ? 'New Password (Optional)' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 pr-10 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                >
                  <option value="creator">Creator (Manage PNGs, Categories)</option>
                  <option value="inspector">Inspector (Review Submissions, Messages)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
                  className="flex-1 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {editingUser ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminManageTeam;
