

import express from 'express';
import Png from '../models/Png.js';
import Category from '../models/Category.js';
import Setting from '../models/Setting.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    // Get all public PNGs
    const pngs = await Png.find({ status: 'approved' }).select('_id updatedAt');
    
    // Get all categories
    const categories = await Category.find().select('slug');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${clientUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${clientUrl}/latest</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${clientUrl}/trending</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${clientUrl}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${clientUrl}/upload</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    // Dynamic Categories
    categories.forEach(cat => {
      xml += `  <url>
    <loc>${clientUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    // Dynamic PNGs
    pngs.forEach(png => {
      xml += `  <url>
    <loc>${clientUrl}/png/${png._id}</loc>
    <lastmod>${new Date(png.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
});

router.get('/robots.txt', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const serverUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:5000';
  // Use serverUrl for sitemap since it's served from the backend
  const robots = `User-agent: *
Allow: /

Sitemap: ${serverUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.status(200).send(robots);
});

export default router;
