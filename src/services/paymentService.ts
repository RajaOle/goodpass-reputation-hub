import { supabase } from '@/integrations/supabase/client';

export interface UploadRepaymentProofRequest {
  reportId: number;
  file: File;
  description?: string;
  amount?: number;
  installmentNumber?: number;
  dueDate?: string;
  uploadedBy: 'reporter' | 'reportee';
}

export interface UploadRepaymentProofResponse {
  success: boolean;
  proofId?: number;
  error?: string;
  message?: string;
}

export interface RepaymentStatus {
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  paymentCount: number;
  isCompleted: boolean;
  lastPaymentDate?: string;
  nextDueDate?: string;
  overdueAmount: number;
}

export interface RepaymentStatusResponse {
  success: boolean;
  status?: RepaymentStatus;
  error?: string;
}

export interface InstallmentSchedule {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface InstallmentScheduleResponse {
  success: boolean;
  schedule?: InstallmentSchedule[];
  error?: string;
}

// Upload repayment proof to the edge function
export const uploadRepaymentProof = async (
  request: UploadRepaymentProofRequest
): Promise<UploadRepaymentProofResponse> => {
  try {
    const formData = new FormData();
    formData.append('reportId', request.reportId.toString());
    formData.append('file', request.file);
    if (request.description) formData.append('description', request.description);
    if (request.amount) formData.append('amount', request.amount.toString());
    if (request.installmentNumber) formData.append('installmentNumber', request.installmentNumber.toString());
    if (request.dueDate) formData.append('dueDate', request.dueDate);
    formData.append('uploadedBy', request.uploadedBy);

    const response = await fetch('https://nnkeqdvbkudgfrtkskae.supabase.co/functions/v1/upload-repayment-proof', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua2VxZHZia3VkZ2ZydGtza2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTg2NDAsImV4cCI6MjA2NjA3NDY0MH0.w3m6GCKqD0ES87NEzA4Qhv-OiC3bDIz8P9zbCMA1h-c',
      },
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading repayment proof:', error);
    return {
      success: false,
      error: 'Failed to upload repayment proof'
    };
  }
};

// Get repayment status for a report
export const getRepaymentStatus = async (reportId: number): Promise<RepaymentStatusResponse> => {
  try {
    const response = await fetch('https://nnkeqdvbkudgfrtkskae.supabase.co/functions/v1/get-repayment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua2VxZHZia3VkZ2ZydGtza2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTg2NDAsImV4cCI6MjA2NjA3NDY0MH0.w3m6GCKqD0ES87NEzA4Qhv-OiC3bDIz8P9zbCMA1h-c',
      },
      body: JSON.stringify({ reportId }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting repayment status:', error);
    return {
      success: false,
      error: 'Failed to get repayment status'
    };
  }
};

// Get installment schedule for a report
export const getInstallmentSchedule = async (reportId: number): Promise<InstallmentScheduleResponse> => {
  try {
    const response = await fetch('https://nnkeqdvbkudgfrtkskae.supabase.co/functions/v1/calculate-installment-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua2VxZHZia3VkZ2ZydGtza2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTg2NDAsImV4cCI6MjA2NjA3NDY0MH0.w3m6GCKqD0ES87NEzA4Qhv-OiC3bDIz8P9zbCMA1h-c',
      },
      body: JSON.stringify({ reportId }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting installment schedule:', error);
    return {
      success: false,
      error: 'Failed to get installment schedule'
    };
  }
};

// Get existing repayment proofs for a report
export const getRepaymentProofs = async (reportId: number) => {
  try {
    const { data, error } = await supabase
      .from('repayment_proof_documents')
      .select('*')
      .eq('report_id', reportId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching repayment proofs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting repayment proofs:', error);
    throw error;
  }
};

// Update installment amount in report_info table
export const updateInstallmentAmount = async (reportId: number, installmentAmount: number) => {
  try {
    // First get the loan_info_id from the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('loan_info_id')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Update the installment_amount in report_info
    const { error: updateError } = await supabase
      .from('report_info')
      .update({ installment_amount: installmentAmount })
      .eq('id', report.loan_info_id);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating installment amount:', error);
    throw error;
  }
}; 