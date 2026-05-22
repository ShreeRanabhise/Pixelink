import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

/**
 * SEO helper component to dynamically inject meta tags into head.
 */
const SEO = ({ 
  title, 
  description = "Download free transparent PNG images, clipart, and graphic vectors with high quality.",
  keywords = "png, free download, transparent image, clipart, Png's, photoshop assets",
  url = window.location.href
}) => {
  const { settings } = useSettings();

  useEffect(() => {
    const siteName = settings.siteName || 'PixelInk';
    const image = settings.logoUrl || '/logo.png';

    // 1. Title
    const formattedTitle = title ? `${title} | ${siteName}` : `${siteName} - High-Quality Transparent PNG Marketplace`;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    // 2. Meta description
    updateMetaTag('description', description);

    // 3. Meta keywords
    updateMetaTag('keywords', keywords);

    // 4. Open Graph Tags
    updateMetaTag('og:title', formattedTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);

    // 5. Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', formattedTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // 6. Favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = image;

  }, [title, description, keywords, url, settings]);

  return null; // Side-effect only component
};

export default SEO;
