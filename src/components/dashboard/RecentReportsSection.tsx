
import React from 'react';
import { Report } from '@/types/report';
import ReportCard from './ReportCard';

interface RecentReportsSectionProps {
  reports: Report[];
  onProcessReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const RecentReportsSection: React.FC<RecentReportsSectionProps> = ({
  reports,
  onProcessReport,
  onRestructure,
  onProcessPayment
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Recent Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onProcessReport={onProcessReport}
            onRestructure={onRestructure}
            onProcessPayment={onProcessPayment}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentReportsSection;
