import React from 'react';
import SEO from '../components/common/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <SEO 
        title="Privacy Policy" 
        description="Learn how Pixelink collects, uses, and protects your information."
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Privacy <span className="text-transparent bg-clip-text bg-gradient-brand">Policy</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="glass p-8 sm:p-12 rounded-[2rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-8 text-slate-700 dark:text-slate-300">
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to Pixelink. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. The Data We Collect</h2>
          <p className="leading-relaxed">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. How We Use Your Data</h2>
          <p className="leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
            <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
            <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
            <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Data Security</h2>
          <p className="leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
