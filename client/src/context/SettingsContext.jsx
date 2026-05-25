import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // Fallbacks if data is not loaded yet
  const settings = data || {
    siteName: 'PixelInk',
    heroTitle: 'Download High-Quality Transparent PNG Images Free',
    heroSubtitle: 'Discover and share millions of free transparent PNGs across 0+ categories no sign up required.',
    logoUrl: '/logo.png'
  };

  const safeSettings = {
    ...settings,
    logoUrl: '/logo.png' // Always use the local file from public/logo.png
  };

  // Sync the browser favicon to the new logo
  React.useEffect(() => {
    if (safeSettings.logoUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = safeSettings.logoUrl;
    }
  }, [safeSettings.logoUrl]);

  return (
    <SettingsContext.Provider value={{ settings: safeSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};
