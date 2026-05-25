import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <SettingsProvider>
              <AuthProvider>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800',
                    duration: 4000,
                  }}
                />
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
