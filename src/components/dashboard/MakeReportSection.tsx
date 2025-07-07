import React, { useState } from 'react';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import QuickActionsSection from './QuickActionsSection';
import RecentReportsSection from './RecentReportsSection';
import { Report } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';
import { useKyc } from '@/contexts/KycContext';
import NewReportDialog from '../report-dialog/NewReportDialog';

const MakeReportSection = () => {
  const [dialogMode, setDialogMode] = useState<'new' | 'restructure' | 'addInfo' | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { reports, isLoading, error } = useReports();
  const { kycStatus } = useKyc();

  const handleProcessReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleRestructure = (report: Report) => {
    setSelectedReport(report);
    setDialogMode('restructure');
  };

  const handleProcessPayment = (report: Report) => {
    setSelectedReport(report);
    setIsPaymentOpen(true);
    console.log('handleProcessPayment called:', { report });
  };

  const handleAddInfo = (report: Report) => {
    setSelectedReport(report);
    setDialogMode('addInfo');
  };

  const handleNewReport = () => {
    setSelectedReport(null);
    setDialogMode('new');
  };

  const handleDialogClose = () => {
    setDialogMode(null);
    setSelectedReport(null);
  };

  if (kycStatus !== 'verified') {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">KYC Required</h2>
        <p className="text-yellow-700 mb-4">You must complete KYC verification in your account settings before you can make a report.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Reports</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <QuickActionsSection onNewReportClick={handleNewReport} />
      <RecentReportsSection 
        reports={reports}
        onProcessReport={handleProcessReport}
        onRestructure={handleRestructure}
        onProcessPayment={handleProcessPayment}
        onAddInfo={handleAddInfo}
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
        </>
      )}

      {dialogMode && (
        <NewReportDialog
          open={!!dialogMode}
          onOpenChange={handleDialogClose}
          isRestructure={dialogMode === 'restructure'}
          isAddInfo={dialogMode === 'addInfo'}
          existingReport={dialogMode !== 'new' ? selectedReport : undefined}
        />
      )}
    </div>
  );
};

export default MakeReportSection;
