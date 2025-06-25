
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface QuickActionsProps {
  onNewReport: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewReport }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex justify-start">
        <Button 
          className="h-16 bg-blue-600 hover:bg-blue-700 text-white justify-start"
          onClick={onNewReport}
        >
          <Plus className="h-5 w-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Write New Report</div>
            <div className="text-sm opacity-90">Share your experience</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
