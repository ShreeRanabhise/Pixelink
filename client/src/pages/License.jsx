import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const License = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SEO title="License & Usage" description="PixelInk License and usage policy" />
      
      <div className="space-y-6 glass bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 rounded-3xl shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          License & Usage
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          Last updated: May 28, 2026
        </p>

        <p>
          This License explains how you may use PNG images and other resources downloaded from PixelInk. Please read carefully before using any asset in your projects.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Default license
        </h2>
        <p className="mb-6">
          Unless explicitly stated otherwise on the image detail page, downloads from PixelInk are provided for personal, non-commercial use. This includes personal projects, school assignments, hobby designs, and similar non-commercial purposes.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. What you may do
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Use downloaded PNGs in personal designs, presentations, and non-commercial content.</li>
          <li>Resize, crop, or otherwise modify the assets to fit your project.</li>
          <li>Share the final design publicly, provided the PNG asset itself is not the primary product being sold.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. What you may not do
        </h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Sell, sub-license, or redistribute the original PNG file by itself or as part of a stock-asset collection.</li>
          <li>Use the assets in a way that infringes anyone’s intellectual-property rights, privacy, or publicity rights.</li>
          <li>Use the assets in defamatory, hateful, pornographic, or otherwise unlawful content.</li>
          <li>Imply that the original copyright holder endorses your product, service, or organization without permission.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          4. Commercial use
        </h2>
        <p className="mb-6">
          Many PNGs on PixelInk are user-submitted, and the underlying copyright belongs to the original creator. If you wish to use an asset for commercial purposes, please ensure you have obtained the necessary rights directly from the original copyright owner. PixelInk does not grant commercial rights to assets it does not own.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          5. Attribution
        </h2>
        <p className="mb-6">
          Attribution is appreciated but not required for the default license, unless specifically noted on the image detail page. A simple credit such as “Image via PixelInk” with a link back to our Website is welcomed.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          6. Trademarks and logos
        </h2>
        <p className="mb-6">
          Some PNGs may contain logos or trademarks belonging to third parties. Trademark and brand-name rights are reserved by their respective owners. You are responsible for ensuring that your use of any such asset complies with applicable trademark and fair-use laws.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          7. No warranty
        </h2>
        <p className="mb-6">
          All assets are provided “as is”, without warranty of any kind. PixelInk makes no representation that any asset is free from infringement claims or fit for any particular purpose. Use of any asset is at your own risk.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          8. Reporting issues
        </h2>
        <p className="mb-6">
          If you believe an asset on PixelInk infringes your rights, please file a notice through our <Link to="/dmca" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold underline">DMCA page</Link>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          9. Changes to this license
        </h2>
        <p>
          PixelInk may update this License from time to time. The version posted on this page applies to assets downloaded after the “Last updated” date shown above.
        </p>
      </div>
    </div>
  );
};

export default License;
