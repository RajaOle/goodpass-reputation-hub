
import React from 'react';
import { DashboardSection } from '@/pages/Dashboard';
import DashboardOverview from './dashboard/DashboardOverview';
import MakeReportSection from './dashboard/MakeReportSection';
import ReportsSection from './dashboard/ReportsSection';
import RecentActivitySection from './dashboard/RecentActivitySection';
import SearchRecordsSection from './dashboard/SearchRecordsSection';
import PurchaseCreditsSection from './dashboard/PurchaseCreditsSection';
import SettingsSection from './dashboard/SettingsSection';
import ProfileSection from './dashboard/ProfileSection';
import LogoutSection from './dashboard/LogoutSection';

interface DashboardContentProps {
  activeSection: DashboardSection;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'make-report':
        return <MakeReportSection />;
      case 'reports':
        return <ReportsSection />;
      case 'activity':
        return <RecentActivitySection />;
      case 'search':
        return <SearchRecordsSection />;
      case 'credits':
        return <PurchaseCreditsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'logout':
        return <LogoutSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
