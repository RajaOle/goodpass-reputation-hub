
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface QuickActionsSectionProps {
  onNewReportClick: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ onNewReportClick }) => {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
      <div className="flex justify-start">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white justify-start h-14 sm:h-16 w-auto px-4 sm:px-6"
          onClick={onNewReportClick}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium text-sm sm:text-base">Write New Report</div>
            <div className="text-xs sm:text-sm opacity-90">Share your experience</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsSection;
