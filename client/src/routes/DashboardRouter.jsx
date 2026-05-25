import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CreatorDashboard from '../pages/admin/CreatorDashboard';
import InspectorDashboard from '../pages/admin/InspectorDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'creator':
      return <CreatorDashboard />;
    case 'inspector':
      return <InspectorDashboard />;
    case 'admin':
    default:
      return <AdminDashboard />;
  }
};

export default DashboardRouter;
