import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Mock API call
    setTimeout(() => {
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: 'Query',
        message: '',
      });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <SEO title="Contact Us" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 border border-brand-500/30 text-brand-400">
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          Get In Touch
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          We'd Love to Hear From You
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Have feedback, feature requests, or questions about copyright? Send us a message and we'll respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info (Left Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You can reach us through any of the following channels or fill out the form.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email us</p>
                    <a href={`mailto:${settings.contactEmail}`} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Call us</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {settings.contactPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Visit us</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {settings.contactAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
              <p className="text-xs text-slate-400">Response time guarantee</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center">
                Under 24 hours <ArrowRight className="w-4 h-4 ml-1.5 text-brand-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Panel) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Send Message</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Message Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all appearance-none"
                >
                  <option value="Query">Query</option>
                  <option value="Suggestion">Suggestion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message details here..."
                rows="5"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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
