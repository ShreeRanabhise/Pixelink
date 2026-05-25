import { Helmet } from 'react-helmet-async';
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

  const siteName = settings?.siteName || 'PixelInk';
  const image = settings?.logoUrl || '/logo.png';
  const formattedTitle = title ? `${title} | ${siteName}` : `${siteName} - High-Quality Transparent PNG Marketplace`;

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon Sync */}
      <link rel="icon" href={image} />
    </Helmet>
  );
};

export default SEO;
