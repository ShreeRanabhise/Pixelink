import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileImage, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Zap, 
  Shield, 
  Mail,
  Layers
} from 'lucide-react';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO title="About Us" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-10 sm:p-16 border border-amber-100/50 dark:border-slate-800/60 bg-gradient-to-br from-rose-50 via-orange-50/50 to-amber-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-white/60 to-transparent dark:from-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/30 text-rose-500 text-xs font-bold shadow-sm">
            <FileImage className="w-3.5 h-3.5" />
            <span>About Pixelink</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
            Your creative destination for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-500">high-quality PNG images</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to Pixelink your creative destination for high-quality PNG images, transparent backgrounds, graphic resources, and design inspiration.
          </p>
        </div>
      </div>

      {/* Intro Paragraphs */}
      <div className="p-8 sm:p-10 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-6 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          At <strong className="text-slate-800 dark:text-slate-200">Pixelink</strong>, we believe creativity should be fast, simple, and accessible for everyone. Whether you are a graphic designer, content creator, student, business owner, video editor, or social media marketer, our platform helps you find professional PNG assets without wasting time.
        </p>
        <p>
          Our mission is to provide clean, high-resolution, and easy-to-download transparent PNG images that help creators build better designs, presentations, websites, advertisements, and digital content.
        </p>
      </div>

      {/* AdSense Placeholder */}
      <div className="w-full h-32 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400">
        <AdBanner adSlot="about_in_content" className="w-full h-full flex items-center justify-center" />
      </div>

      {/* What we offer */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">What we offer</h2>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          We continuously update our library with fresh and trending content so users can always discover new creative resources for their projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {[
            'Transparent PNG Images',
            'HD Graphic Resources',
            'Background-Free Images',
            'Design Elements & Icons',
            'Creative Assets for Social Media',
            'Fast & Easy Downloads',
            'Mobile-Friendly Experience'
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 hover:shadow-md transition-shadow">
              <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why choose PixelInk */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Why choose PixelInk?</h2>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          A platform built with creators in mind every detail tuned for speed, quality, and convenience.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          
          <div className="p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 space-y-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">High-Quality Resources</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Every image on Pixelink is selected carefully to maintain clarity, quality, and usability for personal and professional design work.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 space-y-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">User-Friendly Experience</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Our platform is designed with simplicity in mind. You can quickly search, preview, and download PNG images in just a few clicks.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 space-y-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Fast Performance</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              We optimize our website for speed and smooth browsing, making it easy for users to find what they need without delays.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 space-y-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Free & Accessible</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Many resources are available for free, helping creators, students, startups, and businesses save time and money.
            </p>
          </div>

        </div>
      </div>

      {/* Our Vision */}
      <div className="p-8 sm:p-10 rounded-[2rem] bg-slate-900 text-white shadow-xl space-y-4">
        <h2 className="text-2xl font-black">Our vision</h2>
        <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-4xl">
          Our vision is to become one of the most trusted creative resource platforms for designers and digital creators worldwide. We aim to build a platform where creativity meets convenience.
        </p>
      </div>

      {/* Copyright & Fair Use */}
      <div className="p-8 sm:p-10 rounded-[2rem] border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-500">
          <Shield className="w-5 h-5" />
          <h2 className="text-lg font-black">Copyright & Fair Use</h2>
        </div>
        <p className="text-xs font-medium text-amber-700 dark:text-amber-600/80 leading-relaxed max-w-4xl">
          Pixelink respects the intellectual property rights of creators and copyright owners. If you believe any content on our website violates your copyright, please contact us through our DMCA page, and we will review the request promptly.
        </p>
      </div>

      {/* Contact Us */}
      <div className="p-10 sm:p-16 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 shadow-sm flex flex-col items-center text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Contact us</h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          We value feedback, suggestions, and collaboration opportunities. If you have any questions or business inquiries, feel free to reach out through our Contact Us page.
        </p>
        <Link to="/" className="inline-block px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-full transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Back to Home
        </Link>
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pb-10">
        Thank you for visiting <strong className="text-slate-700 dark:text-slate-300">Pixelink</strong> and being part of our creative community.
      </p>

    </div>
  );
};

export default About;
