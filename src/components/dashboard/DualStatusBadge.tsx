
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ReportStatus, ReportLifecycleStatus } from '@/types/report';

interface DualStatusBadgeProps {
  verificationStatus: ReportStatus;
  reportStatus?: ReportLifecycleStatus;
}

const DualStatusBadge: React.FC<DualStatusBadgeProps> = ({ 
  verificationStatus, 
  reportStatus 
}) => {
  const getVerificationStatusConfig = (status: ReportStatus) => {
    const statusConfig = {
      pending: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      verified: { label: 'Verified', color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
      'partially-verified': { label: 'Partially Verified', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' }
    };

    return statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-700 border-gray-200' 
    };
  };

  const getReportStatusConfig = (status: ReportLifecycleStatus) => {
    const statusConfig = {
      'under-review': { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'active': { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'live': { label: 'Live', color: 'bg-purple-100 text-purple-700 border-purple-200' }
    };

    return statusConfig[status];
  };

  // Determine the report status based on verification status if not explicitly set
  const effectiveReportStatus = reportStatus || (
    verificationStatus === 'verified' || verificationStatus === 'partially-verified' ? 'active' :
    verificationStatus === 'pending' ? 'under-review' :
    'under-review'
  );

  const verificationConfig = getVerificationStatusConfig(verificationStatus);
  const reportConfig = getReportStatusConfig(effectiveReportStatus);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Report:</span>
        <Badge variant="outline" className={`${reportConfig.color} border font-medium text-xs`}>
          {reportConfig.label}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Verification:</span>
        <Badge variant="outline" className={`${verificationConfig.color} border font-medium text-xs`}>
          {verificationConfig.label}
        </Badge>
      </div>
    </div>
  );
};

export default DualStatusBadge;
