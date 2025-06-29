
import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardContent from '@/components/DashboardContent';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { useAuth } from '@/contexts/AuthContext';

export type DashboardSection = 
  | 'overview' 
  | 'make-report' 
  | 'reports'
  | 'activity'
  | 'search' 
  | 'credits' 
  | 'settings' 
  | 'profile' 
  | 'logout';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ReportsProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <DashboardContent activeSection={activeSection} />
      </div>
    </ReportsProvider>
  );
};

export default Dashboard;
