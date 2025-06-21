
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  PenTool, 
  Search, 
  CreditCard, 
  Settings, 
  User, 
  LogOut,
  TrendingUp
} from 'lucide-react';
import { DashboardSection } from '@/pages/Dashboard';

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const menuItems = [
    { id: 'overview' as DashboardSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'make-report' as DashboardSection, label: 'Make Report', icon: PenTool },
    { id: 'search' as DashboardSection, label: 'Search Records', icon: Search },
    { id: 'credits' as DashboardSection, label: 'Purchase Credits', icon: CreditCard },
    { id: 'settings' as DashboardSection, label: 'Settings', icon: Settings },
    { id: 'profile' as DashboardSection, label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/">
          <img 
            src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" 
            alt="Goodpass Logo" 
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </Link>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-600">john@example.com</p>
          </div>
        </div>

        {/* GP Score */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-900">GP Score</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">750</div>
          <p className="text-xs text-blue-700">Good standing</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-10 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onSectionChange('logout')}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
