
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report, ReportStatus } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import ProcessPaymentDialog from './ProcessPaymentDialog';
import RestructureDialog from './RestructureDialog';
import ReportsHeader from './reports/ReportsHeader';
import ReportsTabContent from './reports/ReportsTabContent';

const ReportsSection = () => {
  const { reports } = useReports();
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);

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

  const handleProcessReport = (report: Report) => {
    setSelectedReport(report);
    setIsProcessPaymentOpen(true);
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
            onProcessPayment={handleProcessReport}
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
              onProcessPayment={handleProcessReport}
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
          <ProcessPaymentDialog
            open={isProcessPaymentOpen}
            onOpenChange={setIsProcessPaymentOpen}
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
