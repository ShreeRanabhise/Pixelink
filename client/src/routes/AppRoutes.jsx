import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout wraps
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdBanner from '../components/common/AdBanner';

// Loaders
import LoaderCircle from 'lucide-react/dist/esm/icons/loader'; // standard loader icon or styling

const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />

    <main className="flex-grow">{children}</main>
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12">
      <AdBanner adSlot="global-bottom-footer" className="min-h-[90px]" />
    </div>
    <Footer />
  </div>
);

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    <p className="text-sm text-slate-500 dark:text-slate-400">Loading Pixelink...</p>
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import('../pages/Home'));
const Categories = lazy(() => import('../pages/Categories'));
const CategoryDetail = lazy(() => import('../pages/CategoryDetail'));
const PngDetail = lazy(() => import('../pages/PngDetail'));
const SearchResults = lazy(() => import('../pages/SearchResults'));
const TrendingPngs = lazy(() => import('../pages/TrendingPngs'));
const LatestUploads = lazy(() => import('../pages/LatestUploads'));
const PublicUpload = lazy(() => import('../pages/PublicUpload'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUploadPng = lazy(() => import('../pages/admin/AdminUploadPng'));
const AdminManagePngs = lazy(() => import('../pages/admin/AdminManagePngs'));
const AdminManageCategories = lazy(() => import('../pages/admin/AdminManageCategories'));
const AdminPendingSubmissions = lazy(() => import('../pages/admin/AdminPendingSubmissions'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminMessages = lazy(() => import('../pages/admin/AdminMessages'));

// Protected Route wrapper with RBAC
const ProtectedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/categories" element={<AppLayout><Categories /></AppLayout>} />
        <Route path="/category/:slug" element={<AppLayout><CategoryDetail /></AppLayout>} />
        <Route path="/png/:slug" element={<AppLayout><PngDetail /></AppLayout>} />
        <Route path="/search" element={<AppLayout><SearchResults /></AppLayout>} />
        <Route path="/trending" element={<AppLayout><TrendingPngs /></AppLayout>} />
        <Route path="/latest" element={<AppLayout><LatestUploads /></AppLayout>} />
        <Route path="/submit" element={<AppLayout><PublicUpload /></AppLayout>} />
        <Route path="/about" element={<AppLayout><About /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'creator', 'inspector']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/upload" element={
          <ProtectedRoute allowedRoles={['admin', 'creator']}>
            <AdminUploadPng />
          </ProtectedRoute>
        } />
        <Route path="/admin/pngs" element={
          <ProtectedRoute allowedRoles={['admin', 'creator']}>
            <AdminManagePngs />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={['admin', 'creator']}>
            <AdminManageCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/submissions" element={
          <ProtectedRoute allowedRoles={['admin', 'inspector']}>
            <AdminPendingSubmissions />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute allowedRoles={['admin', 'inspector']}>
            <AdminMessages />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />

        {/* 404 Catch All */}
        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
