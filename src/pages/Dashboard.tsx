
import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardContent from '@/components/DashboardContent';
import { ReportsProvider } from '@/contexts/ReportsContext';

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
