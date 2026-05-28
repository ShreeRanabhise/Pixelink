import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const DMCA = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SEO title="DMCA Policy" description="PixelInk DMCA Copyright Infringement Policy" />
      
      <div className="space-y-6 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 rounded-3xl shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          DMCA Policy
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          Last updated: May 28, 2026
        </p>

        <p>
          PixelInk respects the intellectual-property rights of others and expects users of the Website to do the same. This page explains how to file a notice of alleged copyright infringement under the Digital Millennium Copyright Act (“DMCA”) and similar laws.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Reporting alleged infringement
        </h2>
        <p className="mb-4">
          If you believe that content available on PixelInk infringes a copyright you own or control, please send a written notice that includes all of the following information:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
          <li>A clear identification of the copyrighted work that you claim has been infringed.</li>
          <li>The exact URL(s) on PixelInk where the allegedly infringing material is located, so we can find it.</li>
          <li>Your full name, mailing address, telephone number, and email address.</li>
          <li>A statement that you have a good-faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or are authorized to act on behalf of the owner.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. Where to send the notice
        </h2>
        <p className="mb-6">
          Send your DMCA notice to us through the form on our <Link to="/contact" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">Contact page</Link> with the subject line “DMCA Notice”. Notices that are incomplete or do not comply with the requirements above may be rejected.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. Our response
        </h2>
        <p className="mb-6">
          Upon receiving a valid notice, we will review the report and may, in our discretion, remove or disable access to the allegedly infringing material. We may also notify the person who uploaded the material that it has been removed.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          4. Counter-notice
        </h2>
        <p className="mb-4">
          If you believe that content was removed in error or that you have the right to use the material, you may submit a counter-notice that includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Your physical or electronic signature.</li>
          <li>Identification of the material that was removed and the URL where it appeared.</li>
          <li>A statement, made under penalty of perjury, that you have a good-faith belief that the material was removed by mistake or misidentification.</li>
          <li>Your full name, mailing address, telephone number, and consent to the jurisdiction of the applicable courts.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          5. Repeat infringers
        </h2>
        <p className="mb-6">
          It is PixelInk’s policy to terminate the accounts and remove the content of users who are determined to be repeat infringers in appropriate circumstances.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          6. Misrepresentation
        </h2>
        <p className="mb-6">
          Please note that under applicable law, knowingly misrepresenting that material is infringing, or that material was removed by mistake or misidentification, may subject you to liability for damages, including costs and attorneys’ fees.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          7. Changes
        </h2>
        <p>
          We may update this DMCA Policy from time to time. The current version is always available on this page.
        </p>
      </div>
    </div>
  );
};

export default DMCA;
