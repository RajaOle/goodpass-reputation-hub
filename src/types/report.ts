
export interface LoanInformation {
  loanType: 'personal' | 'business' | 'mortgage' | 'auto' | 'student' | 'other';
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  loanPurpose: string;
  collateral?: string;
}

export interface PersonalReporteeInformation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface BusinessReporteeInformation {
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  website?: string;
}

export interface ReporteeInformation {
  type: 'personal' | 'business';
  personalInfo?: PersonalReporteeInformation;
  businessInfo?: BusinessReporteeInformation;
}

export interface SupportingDocuments {
  documents: File[];
  additionalNotes?: string;
}

export interface ReportFormData {
  loanInformation: LoanInformation;
  reporteeInformation: ReporteeInformation;
  supportingDocuments: SupportingDocuments;
}
