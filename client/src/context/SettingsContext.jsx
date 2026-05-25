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

  let logoUrl = '/logo.png';

  return (
    <SettingsContext.Provider value={{ settings: { ...settings, logoUrl }, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};
