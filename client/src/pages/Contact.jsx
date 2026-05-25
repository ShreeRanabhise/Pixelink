import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';

import api from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'Query',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { settings } = useSettings();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/contact-messages', formData);
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: 'Query',
        message: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <SEO title="Contact Us" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase bg-brand-500/10 border border-brand-500/30 text-brand-500 shadow-sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          We'd Love to <span className="text-transparent bg-clip-text bg-gradient-brand">Hear From You</span>
        </h1>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          Have feedback, feature requests, or questions about copyright? Send us a message and we'll respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info (Left Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 space-y-6 h-full flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Glow */}
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"></div>
            
            <div className="space-y-8 relative z-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Contact Info</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                You can reach us through any of the following channels or fill out the form.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-5">
                  <div className="p-3.5 bg-brand-500/10 text-brand-500 rounded-2xl shadow-inner">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email us</p>
                    <a href={`mailto:${settings.contactEmail}`} className="text-sm font-black text-slate-800 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-5">
                  <div className="p-3.5 bg-brand-500/10 text-brand-500 rounded-2xl shadow-inner">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Call us</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {settings.contactPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-5">
                  <div className="p-3.5 bg-brand-500/10 text-brand-500 rounded-2xl shadow-inner">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Visit us</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {settings.contactAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Response time guarantee</p>
              <p className="text-sm font-black text-slate-700 dark:text-slate-300 mt-1 flex items-center">
                Under 24 hours <ArrowRight className="w-4 h-4 ml-1.5 text-brand-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Panel) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 space-y-8 shadow-xl relative overflow-hidden">
             {/* Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"></div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 relative z-10">Send Message</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Full Name <span className="text-brand-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-700/50 glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Email Address <span className="text-brand-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-700/50 glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Message Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-700/50 glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all appearance-none shadow-sm"
                >
                  <option value="Query">Query</option>
                  <option value="Suggestion">Suggestion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-700/50 glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Message <span className="text-brand-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message details here..."
                rows="5"
                className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-700/50 glass bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/20 focus:outline-none transition-all resize-none shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="relative z-10 inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest bg-gradient-brand text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-500/25"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
