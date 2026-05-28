import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AdBanner = ({ adSlot, format = 'auto', responsive = 'true', className = '' }) => {
  const { settings } = useSettings();
  const clientId = settings?.adsenseClientId || import.meta.env.VITE_ADSENSE_CLIENT_ID;

  if (!settings?.adsenseEnabled) {
    return null;
  }

  useEffect(() => {
    // Only push if adsbygoogle is available and we have a valid client ID
    if (clientId && clientId !== 'ca-pub-XXXXXXXXXXXXXXXX' && window) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [clientId]);

  // Fallback UI for local development or missing ID
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div className={`w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white/50 text-sm font-medium ${className}`} style={{ minHeight: '100px' }}>
        Advertisement Space (AdSense Pending)
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default AdBanner;
