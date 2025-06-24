
export interface LoanInformation {
  loanType: 'personal' | 'business' | 'mortgage' | 'auto' | 'student' | 'other';
  loanAmount: number;
  loanTerm: number;
  monthlyPayment: number;
  loanPurpose: string;
  collateral?: string;
  paymentMethod: 'one-time' | 'installments' | 'open-payment';
  installmentCount?: number;
}

export interface ReporteeInformation {
  fullName: string;
  phoneNumber: string;
  email?: string;
  nationalId?: string;
  socialMediaLinks?: string[];
}

export interface SupportingDocuments {
  documents: File[];
  additionalNotes?: string;
}

export type ReportStatus = 'draft' | 'pending' | 'verified' | 'rejected' | 'partially-verified';

export type PaymentMethod = 'full' | 'installment' | 'open-payment';

export interface OpenPayment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
  runningBalance: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: 'paid' | 'unpaid';
  installments?: {
    number: number;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
  }[];
  openPayments?: OpenPayment[];
  totalPaid?: number;
  remainingBalance?: number;
}

export interface Report {
  id: string;
  status: ReportStatus;
  loanInformation: LoanInformation;
  reporteeInformation: ReporteeInformation;
  supportingDocuments: SupportingDocuments;
  paymentInfo?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ReportFormData {
  loanInformation: LoanInformation;
  reporteeInformation: ReporteeInformation;
  supportingDocuments: SupportingDocuments;
}

export interface ActivityLog {
  id: string;
  reportId: string;
  action: string;
  timestamp: string;
  details?: string;
}
