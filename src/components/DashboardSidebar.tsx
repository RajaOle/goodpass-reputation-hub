
import React, { useEffect, useState } from 'react';
import { 
  User, 
  LayoutDashboard, 
  FileText, 
  Search, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { DashboardSection } from '@/pages/Dashboard';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

interface User {
  email: string;
  role: string;
  name: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { id: 'overview' as DashboardSection, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'make-report' as DashboardSection, icon: FileText, label: 'Make a Report' },
    { id: 'search' as DashboardSection, icon: Search, label: 'Search Record' },
    { id: 'credits' as DashboardSection, icon: CreditCard, label: 'Purchase Credit' },
    { id: 'settings' as DashboardSection, icon: Settings, label: 'Settings' },
    { id: 'profile' as DashboardSection, icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.name || 'User'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.role || 'user'}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-green-600 font-medium">
                    Credits: 150
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsCollapsed(true); // Close mobile menu after selection
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => onSectionChange('logout')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
