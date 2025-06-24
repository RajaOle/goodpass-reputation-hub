
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

interface ReportsHeaderProps {
  onCreateReport: () => void;
}

const ReportsHeader = ({ onCreateReport }: ReportsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Manage your credit reports and track their status.</p>
      </div>
      <Button onClick={onCreateReport} className="bg-blue-600 hover:bg-blue-700">
        <FileText className="h-4 w-4 mr-2" />
        Create New Report
      </Button>
    </div>
  );
};

export default ReportsHeader;
