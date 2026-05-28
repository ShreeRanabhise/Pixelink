import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SEO title="Privacy Policy" description="PixelInk Privacy Policy" />
      
      <div className="space-y-6 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 rounded-3xl shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          Last updated: May 28, 2026
        </p>

        <p>
          This Privacy Policy explains how PixelInk (“we”, “our”, “us”) collects, uses, and protects information when you visit pixelink.com (the “Website”). By using our Website, you agree to the practices described below.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Information we collect
        </h2>
        <p className="mb-4">
          We aim to collect only the minimum information needed to operate and improve our service.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Information you provide.</strong> When you submit a PNG, leave feedback, or contact us, you may share a title, tags, an optional display name, and the file itself.</li>
          <li><strong>Automatically collected information.</strong> When you visit the Website, our servers may log standard data such as your IP address, browser type and version, device type, pages viewed, referring URLs, and date/time of visit.</li>
          <li><strong>Cookies and similar technologies.</strong> We use small text files called cookies to remember preferences, measure traffic, and serve advertisements. You can disable cookies in your browser at any time.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. How we use information
        </h2>
        <p className="mb-4">
          We use collected information to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Operate, maintain, and improve the Website.</li>
          <li>Display uploaded PNGs and related metadata in our catalog and search results.</li>
          <li>Detect, prevent, and respond to fraud, abuse, security issues, or technical problems.</li>
          <li>Communicate with you about your submissions or inquiries.</li>
          <li>Comply with legal obligations and enforce our Terms of Service.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. Advertising and Google AdSense
        </h2>
        <p className="mb-4">
          We may use third-party advertising partners, including Google AdSense, to show ads on the Website. These partners may use cookies, web beacons, or device identifiers to serve advertisements based on your visits to this and other websites.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Google’s use of advertising cookies enables it and its partners to serve ads to users based on visits to our and other sites on the Internet.</li>
          <li>You may opt out of personalized advertising by visiting Google Ads Settings.</li>
          <li>You may also opt out of third-party vendor use of cookies for personalized advertising via aboutads.info.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          4. Analytics
        </h2>
        <p className="mb-6">
          We may use analytics services (such as Google Analytics) to understand how visitors use the Website. These services may collect information about your activity on this site. The data is processed in aggregate form and does not identify individual users to us.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          5. Sharing of information
        </h2>
        <p className="mb-4">
          We do not sell your personal information. We may share information with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Service providers who help us operate the Website (such as hosting, CDN, and analytics providers).</li>
          <li>Advertising partners, as described above.</li>
          <li>Law-enforcement or government agencies when required by law or to protect our rights.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          6. Data retention
        </h2>
        <p className="mb-6">
          We retain information for as long as needed to provide the service and meet legal obligations. Logs and analytics data are typically retained for a limited period and then deleted or anonymized.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          7. Your choices and rights
        </h2>
        <p className="mb-6">
          Depending on where you live, you may have rights to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, contact us using the details on our <Link to="/contact" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">Contact page</Link>. We may need to verify your identity before responding.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          8. Children’s privacy
        </h2>
        <p className="mb-6">
          The Website is not directed to children under 13 (or the equivalent minimum age in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided us personal data, please contact us so we can take appropriate action.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          9. International transfers
        </h2>
        <p className="mb-6">
          Our servers and service providers may be located in countries other than your own. By using the Website, you consent to the transfer of your information to those countries, which may have data-protection laws different from the laws of your country.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          10. Security
        </h2>
        <p className="mb-6">
          We use reasonable technical and organizational measures to protect the information we hold. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          11. Changes to this policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. When we do, we will revise the “Last updated” date at the top of this page. Material changes may also be highlighted on the Website.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          12. Contact us
        </h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please reach out via our <Link to="/contact" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">Contact page</Link>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
