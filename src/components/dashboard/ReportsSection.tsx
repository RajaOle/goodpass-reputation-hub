
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report, ReportStatus } from '@/types/report';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import RestructureDialog from './RestructureDialog';
import ReportsHeader from './reports/ReportsHeader';
import ReportsTabContent from './reports/ReportsTabContent';

const ReportsSection = () => {
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);

  // Mock data - in real app this would come from API
  const reports: Report[] = [
    {
      id: '1',
      status: 'pending',
      loanInformation: {
        loanName: 'Home Renovation Loan',
        loanType: 'personal',
        loanAmount: 50000000,
        agreementDate: '2024-01-10',
        disbursementDate: '2024-01-15',
        dueDate: '2026-01-15',
        loanPurpose: 'home-improvement',
        repaymentPlan: 'monthly',
        installmentCount: 24,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none',
        // Legacy fields for backward compatibility
        loanTerm: 24,
        monthlyPayment: 2500000,
        paymentMethod: 'installments'
      },
      reporteeInformation: {
        fullName: 'John Doe',
        phoneNumber: '+6281234567890',
        email: 'john@example.com'
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: 'All documents provided'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      submittedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      status: 'verified',
      loanInformation: {
        loanName: 'Business Expansion Loan',
        loanType: 'business',
        loanAmount: 100000000,
        agreementDate: '2024-01-05',
        disbursementDate: '2024-01-10',
        dueDate: '2027-01-10',
        loanPurpose: 'business-expansion',
        repaymentPlan: 'monthly',
        installmentCount: 36,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none',
        // Legacy fields for backward compatibility
        loanTerm: 36,
        monthlyPayment: 3500000,
        paymentMethod: 'installments'
      },
      reporteeInformation: {
        fullName: 'Jane Smith',
        phoneNumber: '+6281234567891',
        email: 'jane@example.com'
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: 'Business license attached'
      },
      paymentInfo: {
        method: 'installment',
        status: 'unpaid',
        installments: [
          { number: 1, amount: 3500000, dueDate: '2024-02-15', status: 'paid' },
          { number: 2, amount: 3500000, dueDate: '2024-03-15', status: 'paid' },
          { number: 3, amount: 3500000, dueDate: '2024-04-15', status: 'unpaid' }
        ]
      },
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-12T10:00:00Z',
      submittedAt: '2024-01-10T10:00:00Z',
      reviewedAt: '2024-01-12T10:00:00Z'
    }
  ];

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setIsNewReportOpen(true);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleProcessPayment = (report: Report) => {
    setSelectedReport(report);
    setIsPaymentOpen(true);
  };

  const handleRestructure = (report: Report) => {
    setSelectedReport(report);
    setIsRestructureOpen(true);
  };

  const filteredReports = (status?: ReportStatus) => {
    if (!status) return reports;
    return reports.filter(report => report.status === status);
  };

  return (
    <div className="space-y-8">
      <ReportsHeader onCreateReport={() => setIsNewReportOpen(true)} />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ReportsTabContent
            title="All Reports"
            reports={reports}
            onViewDetails={handleViewDetails}
            onEditReport={handleEditReport}
            onRestructure={handleRestructure}
            onProcessPayment={handleProcessPayment}
          />
        </TabsContent>

        {(['draft', 'pending', 'verified', 'rejected'] as ReportStatus[]).map((status) => (
          <TabsContent key={status} value={status}>
            <ReportsTabContent
              title={`${status.charAt(0).toUpperCase() + status.slice(1)} Reports`}
              status={status}
              reports={filteredReports(status)}
              onViewDetails={handleViewDetails}
              onEditReport={handleEditReport}
              onRestructure={handleRestructure}
              onProcessPayment={handleProcessPayment}
            />
          </TabsContent>
        ))}
      </Tabs>

      <NewReportDialog
        open={isNewReportOpen}
        onOpenChange={setIsNewReportOpen}
        isDraft={selectedReport?.status === 'draft'}
        reportId={selectedReport?.id}
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

export default ReportsSection;
