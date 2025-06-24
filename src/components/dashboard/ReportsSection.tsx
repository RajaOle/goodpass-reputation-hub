
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit, 
  FileText, 
  RefreshCw, 
  CreditCard, 
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Report, ReportStatus } from '@/types/report';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import RestructureDialog from './RestructureDialog';

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
        loanType: 'personal',
        loanAmount: 50000000,
        loanTerm: 24,
        monthlyPayment: 2500000,
        loanPurpose: 'Home renovation and improvement',
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
        loanType: 'business',
        loanAmount: 100000000,
        loanTerm: 36,
        monthlyPayment: 3500000,
        loanPurpose: 'Business expansion',
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
        status: 'belum-lunas',
        installments: [
          { number: 1, amount: 3500000, dueDate: '2024-02-15', status: 'lunas' },
          { number: 2, amount: 3500000, dueDate: '2024-03-15', status: 'lunas' },
          { number: 3, amount: 3500000, dueDate: '2024-04-15', status: 'belum-lunas' }
        ]
      },
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-12T10:00:00Z',
      submittedAt: '2024-01-10T10:00:00Z',
      reviewedAt: '2024-01-12T10:00:00Z'
    }
  ];

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'partially-verified':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      pending: { label: 'Pending', variant: 'default' as const },
      verified: { label: 'Verified', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
      'partially-verified': { label: 'Partially Verified', variant: 'secondary' as const }
    };

    return (
      <Badge variant={statusConfig[status].variant}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusConfig[status].label}</span>
      </Badge>
    );
  };

  const canEdit = (status: ReportStatus) => {
    return ['draft', 'rejected', 'partially-verified'].includes(status);
  };

  const canRestructure = (status: ReportStatus) => {
    return ['verified', 'partially-verified'].includes(status);
  };

  const canProcessPayment = (status: ReportStatus) => {
    return ['verified'].includes(status);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Manage your credit reports and track their status.</p>
        </div>
        <Button onClick={() => setIsNewReportOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reportee</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.reporteeInformation.fullName}</div>
                          <div className="text-sm text-gray-500">{report.reporteeInformation.phoneNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{report.loanInformation.loanType}</TableCell>
                      <TableCell>{formatCurrency(report.loanInformation.loanAmount)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(report)}
                          >
                            View
                          </Button>
                          {canEdit(report.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditReport(report)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canRestructure(report.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestructure(report)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {canProcessPayment(report.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleProcessPayment(report)}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {(['draft', 'pending', 'verified', 'rejected'] as ReportStatus[]).map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className="capitalize">{status} Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reportee</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports(status).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.reporteeInformation.fullName}</div>
                            <div className="text-sm text-gray-500">{report.reporteeInformation.phoneNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{report.loanInformation.loanType}</TableCell>
                        <TableCell>{formatCurrency(report.loanInformation.loanAmount)}</TableCell>
                        <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(report)}
                            >
                              View
                            </Button>
                            {canEdit(report.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReport(report)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canRestructure(report.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestructure(report)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            {canProcessPayment(report.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProcessPayment(report)}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
