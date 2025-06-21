
import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardContent from '@/components/DashboardContent';

export type DashboardSection = 
  | 'overview' 
  | 'make-report' 
  | 'search' 
  | 'credits' 
  | 'settings' 
  | 'profile' 
  | 'logout';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <DashboardContent activeSection={activeSection} />
    </div>
  );
};

export default Dashboard;
