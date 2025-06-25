
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ReportStatusBadgeProps {
  status: string;
}

const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Under Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      verified: { label: 'Verified', variant: 'default' as const, color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-700 border-red-200' },
      'partially-verified': { label: 'Partially Verified', variant: 'outline' as const, color: 'bg-orange-100 text-orange-700 border-orange-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'outline' as const, 
      color: 'bg-gray-100 text-gray-700 border-gray-200' 
    };

    return (
      <Badge variant="outline" className={`${config.color} border font-medium`}>
        {config.label}
      </Badge>
    );
  };

  return getStatusBadge(status);
};

export default ReportStatusBadge;
