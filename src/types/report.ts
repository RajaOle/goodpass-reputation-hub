
export interface LoanInformation {
  loanName: string;
  loanType: 'personal' | 'business' | 'mortgage' | 'auto' | 'student' | 'other';
  loanAmount: number;
  agreementDate: string;
  disbursementDate: string;
  dueDate?: string; // Optional field
  loanPurpose: 'business-expansion' | 'debt-consolidation' | 'home-improvement' | 'education' | 'medical-expenses' | 'wedding' | 'travel' | 'investment' | 'emergency' | 'other';
  customLoanPurpose?: string; // For when 'other' is selected
  repaymentPlan: 'single-payment' | 'installment' | 'open-payment';
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
  idType?: 'national-id' | 'passport' | 'driver-license';
  idPicture?: File;
  socialMediaLinks?: string[];
  bankName?: string;
  bankAccountNumber?: string;
}

export interface SupportingDocuments {
  documents: File[];
  additionalNotes?: string;
}

export type ReportStatus = 'draft' | 'pending' | 'verified' | 'rejected' | 'partially-verified';

// New type for report lifecycle status
export type ReportLifecycleStatus = 'under-review' | 'active' | 'live';

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
  reportStatus?: ReportLifecycleStatus; // New field for report lifecycle status
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
