
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Edit, 
  RefreshCw, 
  CreditCard
} from 'lucide-react';
import { Report } from '@/types/report';
import { 
  getStatusBadge, 
  canEdit, 
  canRestructure, 
  canProcessPayment, 
  formatCurrency 
} from './utils/reportHelpers';

interface ReportsTableProps {
  reports: Report[];
  showStatus?: boolean;
  onViewDetails: (report: Report) => void;
  onEditReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const ReportsTable = ({ 
  reports, 
  showStatus = true, 
  onViewDetails, 
  onEditReport, 
  onRestructure, 
  onProcessPayment 
}: ReportsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reportee</TableHead>
          <TableHead>Loan Type</TableHead>
          <TableHead>Amount</TableHead>
          {showStatus && <TableHead>Status</TableHead>}
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
            {showStatus && <TableCell>{getStatusBadge(report.status)}</TableCell>}
            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(report)}
                >
                  View
                </Button>
                {canEdit(report.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditReport(report)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {canRestructure(report.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestructure(report)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                {canProcessPayment(report.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onProcessPayment(report)}
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
  );
};

export default ReportsTable;
