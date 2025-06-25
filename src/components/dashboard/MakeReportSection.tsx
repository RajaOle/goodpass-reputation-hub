
import React, { useState } from 'react';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import QuickActionsSection from './QuickActionsSection';
import RecentReportsSection from './RecentReportsSection';
import RecentActivityMakeReportSection from './RecentActivityMakeReportSection';
import { Report } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';

const MakeReportSection = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(false);
  const { reports } = useReports();

  const handleProcessReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleRestructure = (report: Report) => {
    setSelectedReport(report);
    setIsRestructureOpen(true);
  };

  const handleProcessPayment = (report: Report) => {
    setSelectedReport(report);
    setIsPaymentOpen(true);
  };

  const handleAddInfo = (report: Report) => {
    setSelectedReport(report);
    setIsAddInfoOpen(true);
  };

  const handleActivityClick = (activity: any) => {
    if (activity.type === 'report-submitted' && activity.reportId) {
      const report = reports.find(r => r.id === activity.reportId.replace('R00', ''));
      if (report) {
        handleProcessReport(report);
      }
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <QuickActionsSection onNewReportClick={() => setIsReportDialogOpen(true)} />
      
      <RecentReportsSection 
        reports={reports}
        onProcessReport={handleProcessReport}
        onRestructure={handleRestructure}
        onProcessPayment={handleProcessPayment}
        onAddInfo={handleAddInfo}
      />

      <RecentActivityMakeReportSection 
        reports={reports}
        onActivityClick={handleActivityClick}
      />

      <NewReportDialog 
        open={isReportDialogOpen} 
        onOpenChange={setIsReportDialogOpen} 
      />

      {selectedReport && (
        <>
          <ReportDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            report={selectedReport}
          />
          <PaymentDialog
            open={isPaymentOpen}
            onOpenChange={setIsPaymentOpen}
            report={selectedReport}
          />
          <NewReportDialog
            open={isRestructureOpen}
            onOpenChange={setIsRestructureOpen}
            isRestructure={true}
            existingReport={selectedReport}
          />
          <NewReportDialog
            open={isAddInfoOpen}
            onOpenChange={setIsAddInfoOpen}
            isAddInfo={true}
            existingReport={selectedReport}
          />
        </>
      )}
    </div>
  );
};

export default MakeReportSection;
