import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

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
    <AdBanner adSlot="global-bottom-footer" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12 min-h-[90px]" />
    <Footer />
  </div>
);

const PageLoader = () => {
  const { settings } = useSettings();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <img 
        src={settings?.logoUrl || '/logo.png'} 
        alt="Loading..." 
        className="w-32 h-auto object-contain drop-shadow-md"
      />
    </div>
  );
};

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
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const DMCA = lazy(() => import('../pages/DMCA'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const CommunityAccess = lazy(() => import('../pages/admin/CommunityAccess'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUploadPng = lazy(() => import('../pages/admin/AdminUploadPng'));
const AdminManagePngs = lazy(() => import('../pages/admin/AdminManagePngs'));
const AdminManageCategories = lazy(() => import('../pages/admin/AdminManageCategories'));
const AdminPendingSubmissions = lazy(() => import('../pages/admin/AdminPendingSubmissions'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminMessages = lazy(() => import('../pages/admin/AdminMessages'));
const AdminAIGenerator = lazy(() => import('../pages/admin/AdminAIGenerator'));

const AdminManageTeam = lazy(() => import('../pages/admin/AdminManageTeam'));

// Protected Route wrapper with RBAC
const ProtectedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/communityaccess" replace />;
  }

  return children;
};

// Layouts and specific role dashboards
const CreatorDashboard = lazy(() => import('../pages/admin/CreatorDashboard'));
const InspectorDashboard = lazy(() => import('../pages/admin/InspectorDashboard'));

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
        <Route path="/terms" element={<AppLayout><TermsOfService /></AppLayout>} />
        <Route path="/privacy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
        <Route path="/dmca" element={<AppLayout><DMCA /></AppLayout>} />

        {/* Admin Login */}
        <Route path="/communityaccess" element={<CommunityAccess />} />

        {/* Creator Routes */}
        <Route path="/creator" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/creator/upload" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <AdminUploadPng />
          </ProtectedRoute>
        } />
        <Route path="/creator/pngs" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <AdminManagePngs />
          </ProtectedRoute>
        } />
        <Route path="/creator/categories" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <AdminManageCategories />
          </ProtectedRoute>
        } />

        {/* Inspector Routes */}
        <Route path="/inspector" element={
          <ProtectedRoute allowedRoles={['inspector']}>
            <InspectorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/inspector/submissions" element={
          <ProtectedRoute allowedRoles={['inspector']}>
            <AdminPendingSubmissions />
          </ProtectedRoute>
        } />
        <Route path="/inspector/messages" element={
          <ProtectedRoute allowedRoles={['inspector']}>
            <AdminMessages />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/upload" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUploadPng />
          </ProtectedRoute>
        } />
        <Route path="/admin/ai-generator" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAIGenerator />
          </ProtectedRoute>
        } />

        <Route path="/admin/pngs" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManagePngs />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/submissions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPendingSubmissions />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMessages />
          </ProtectedRoute>
        } />
        <Route path="/admin/team" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageTeam />
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
