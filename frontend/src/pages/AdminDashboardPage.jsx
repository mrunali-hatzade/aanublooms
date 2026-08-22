import React from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminDashboardPage = ({ onNavigate, navParams }) => {
  return (
    <div className="min-h-[80vh]">
      <AdminDashboard onNavigate={onNavigate} initialTab={navParams?.tab || 'dashboard'} />
    </div>
  );
};
