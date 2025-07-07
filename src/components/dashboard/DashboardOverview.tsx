import React, { useState } from 'react';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import RestructureDialog from './RestructureDialog';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import { Report, ReportStatus } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';

// Mock report data for testing
const mockReport = {
  id: '1',
  status: 'pending' as ReportStatus,
  loanInformation: {
    loanName: 'Test Loan',
    loanType: 'personal',
    loanAmount: 10000000,
    agreementDate: '2024-01-01',
    disbursementDate: '2024-01-02',
    repaymentPlan: 'open-payment',
    installmentCount: 4,
    applicationInterest: 0,
    applicationLateFee: 0,
    collateral: 'none',
    loanPurpose: 'other',
  },
  reporteeInformation: {
    fullName: 'John Doe',
    phoneNumber: '08123456789',
  },
  supportingDocuments: { documents: [] },
  createdAt: '',
  updatedAt: '',
};

const DashboardOverview = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);
  const { reports, isLoading, error } = useReports();

  const handleProcessReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleRestructure = (report: Report) => {
    setSelectedReport(report);
    setIsRestructureOpen(true);
  };

  const handleProcessPayment = (report: Report) => {
    setSelectedReport(report);
    setIsPaymentOpen(true);
  };

  const handleActivityClick = (activity: any) => {
    // If you need to handle activity clicks, update this logic as needed
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Here's what's happening with your Goodpass account today.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards reports={reports} />

      {/* Quick Actions */}
      <QuickActions onNewReport={() => setIsReportDialogOpen(true)} />

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
          <RestructureDialog
            open={isRestructureOpen}
            onOpenChange={setIsRestructureOpen}
            report={selectedReport}
          />
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
