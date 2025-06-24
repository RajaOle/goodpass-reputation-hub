
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  FileText, 
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ReportStatus } from '@/types/report';

export const getStatusIcon = (status: ReportStatus) => {
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

export const getStatusBadge = (status: ReportStatus) => {
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

export const canEdit = (status: ReportStatus) => {
  return ['draft', 'rejected', 'partially-verified'].includes(status);
};

export const canRestructure = (status: ReportStatus) => {
  return ['verified', 'partially-verified'].includes(status);
};

export const canProcessPayment = (status: ReportStatus) => {
  return ['verified'].includes(status);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};
