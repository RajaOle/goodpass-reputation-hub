
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Report, ReportStatus } from '@/types/report';
import { getStatusIcon } from './utils/reportHelpers';
import ReportsTable from './ReportsTable';

interface ReportsTabContentProps {
  title: string;
  status?: ReportStatus;
  reports: Report[];
  onViewDetails: (report: Report) => void;
  onEditReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const ReportsTabContent = ({ 
  title, 
  status, 
  reports, 
  onViewDetails, 
  onEditReport, 
  onRestructure, 
  onProcessPayment 
}: ReportsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {status && getStatusIcon(status)}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReportsTable
          reports={reports}
          showStatus={!status}
          onViewDetails={onViewDetails}
          onEditReport={onEditReport}
          onRestructure={onRestructure}
          onProcessPayment={onProcessPayment}
        />
      </CardContent>
    </Card>
  );
};

export default ReportsTabContent;
