
export interface LoanInformation {
  loanName: string;
  loanType: 'personal' | 'business' | 'mortgage' | 'auto' | 'student' | 'other';
  loanAmount: number;
  agreementDate: string;
  disbursementDate: string;
  dueDate?: string; // Optional field
  loanPurpose: 'business-expansion' | 'debt-consolidation' | 'home-improvement' | 'education' | 'medical-expenses' | 'wedding' | 'travel' | 'investment' | 'emergency' | 'other';
  customLoanPurpose?: string; // For when 'other' is selected
  repaymentPlan: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  installmentCount?: number;
  applicationInterest: number;
  applicationLateFee: number;
  collateral: 'none' | 'property' | 'vehicle' | 'savings' | 'stocks' | 'jewelry' | 'equipment' | 'other';
  collateralDescription?: string;
  collateralValue?: number;
  // Legacy fields for backward compatibility
  loanTerm?: number;
  monthlyPayment?: number;
  paymentMethod?: 'one-time' | 'installments' | 'open-payment';
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
