import React from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminDashboardPage = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh]">
      <AdminDashboard onNavigate={onNavigate} />
    </div>
  );
};
