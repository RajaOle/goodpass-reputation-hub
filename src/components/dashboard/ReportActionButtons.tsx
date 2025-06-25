import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, CreditCard } from 'lucide-react';
import { Report } from '@/types/report';

interface ReportActionButtonsProps {
  report: Report;
  onProcessReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onAddInfo: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const ReportActionButtons: React.FC<ReportActionButtonsProps> = ({
  report,
  onProcessReport,
  onRestructure,
  onAddInfo,
  onProcessPayment
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onProcessReport(report)}
        className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200"
      >
        <Edit className="h-4 w-4 mr-1.5" />
        Process Report
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onRestructure(report)}
        className="flex-1 h-9 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 font-medium transition-all duration-200"
      >
        <RefreshCw className="h-4 w-4 mr-1.5" />
        Restructure
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onAddInfo(report)}
        className="flex-1 h-9 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 font-medium transition-all duration-200"
      >
        <CreditCard className="h-4 w-4 mr-1.5" />
        Add Info
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onProcessPayment(report)}
        className="flex-1 h-9 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200"
      >
        <CreditCard className="h-4 w-4 mr-1.5" />
        Process Payment
      </Button>
    </div>
  );
};

export default ReportActionButtons;
