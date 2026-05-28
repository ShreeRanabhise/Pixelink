import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SEO title="Terms of Service" description="PixelInk Terms of Service and usage guidelines" />
      
      <div className="space-y-6 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 rounded-3xl shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          Last updated: May 28, 2026
        </p>

        <p>
          These Terms of Service (“Terms”) govern your access to and use of pixelink.com (the “Website”). By using the Website you agree to these Terms. If you do not agree, please do not use the Website.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Description of service
        </h2>
        <p className="mb-6">
          PixelInk is a community catalog of transparent PNG images and other graphic resources. Visitors can browse, search, and download PNGs, and may submit their own PNGs for inclusion in the catalog.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. Eligibility
        </h2>
        <p className="mb-6">
          You must be at least 13 years old (or the minimum age in your jurisdiction) to use the Website. By using the Website you represent that you meet this requirement and have the legal capacity to enter into these Terms.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. User submissions
        </h2>
        <p className="mb-4">
          By uploading or submitting any content (“Submission”) to PixelInk, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>You own the Submission or have all necessary rights, licenses, and permissions to share it.</li>
          <li>Your Submission does not infringe any third-party intellectual-property right, privacy right, or other legal right.</li>
          <li>Your Submission does not contain unlawful, defamatory, obscene, hateful, or otherwise objectionable material.</li>
        </ul>
        <p className="mb-6">
          By submitting content, you grant PixelInk a worldwide, non-exclusive, royalty-free license to host, store, display, distribute, and promote the Submission on the Website and our related channels for the purpose of operating the service.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          4. Prohibited conduct
        </h2>
        <p className="mb-4">
          You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Upload content you do not have the right to share.</li>
          <li>Use the Website to distribute malware, spam, or fraudulent material.</li>
          <li>Attempt to disrupt, attack, or gain unauthorized access to the Website or its infrastructure.</li>
          <li>Scrape or collect data from the Website using automated means without our prior written consent.</li>
          <li>Use the Website in a way that violates any applicable law or regulation.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          5. Intellectual property
        </h2>
        <p className="mb-6">
          All PixelInk branding, logos, design, and original written content are the property of PixelInk and protected by applicable intellectual-property laws. Uploaded PNGs remain the property of their respective owners.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          6. License for downloaders
        </h2>
        <p className="mb-6">
          Downloads from PixelInk are provided for personal, non-commercial use unless otherwise stated. Please review our <Link to="/license" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">License page</Link> for full details before using a download in a commercial project.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          7. Removal of content
        </h2>
        <p className="mb-6">
          We may remove any content from the Website at our discretion, without notice, including content that we believe violates these Terms or any applicable law. If you believe a Submission infringes your rights, please follow the procedure described on our <Link to="/dmca" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">DMCA page</Link>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          8. Third-party services and advertising
        </h2>
        <p className="mb-6">
          The Website may include advertisements served by third parties such as Google AdSense, as well as links to third-party sites. We are not responsible for the content, policies, or practices of any third party.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          9. Disclaimers
        </h2>
        <p className="mb-6">
          The Website and all content are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that the Website will be uninterrupted, secure, or error-free.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          10. Limitation of liability
        </h2>
        <p className="mb-6">
          To the maximum extent permitted by law, PixelInk and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or use, arising out of or in connection with your use of the Website.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          11. Indemnification
        </h2>
        <p className="mb-6">
          You agree to indemnify and hold harmless PixelInk and its operators from any claims, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of your use of the Website or your violation of these Terms.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          12. Termination
        </h2>
        <p className="mb-6">
          We may suspend or terminate your access to the Website at any time, for any reason, including violation of these Terms. Provisions that by their nature should survive termination will survive.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          13. Changes to these Terms
        </h2>
        <p className="mb-6">
          We may update these Terms from time to time. Continued use of the Website after changes are posted constitutes your acceptance of the updated Terms.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          14. Contact
        </h2>
        <p>
          If you have questions about these Terms, please visit our <Link to="/contact" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">Contact page</Link>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
